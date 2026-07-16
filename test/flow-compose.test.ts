import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';

const LANGUAGES = ['en', 'nl', 'de', 'fr', 'es', 'it', 'da', 'sv', 'no', 'pl'];
const DRIVERS = [
  'virtual-boolean',
  'virtual-button',
  'virtual-number',
  'virtual-string',
  'virtual-temperature',
  'virtual-power',
  'virtual-battery',
];

interface FlowCard {
  id: string;
  title: Record<string, string>;
  titleFormatted?: Record<string, string>;
  args?: Array<{ name: string; type: string; title?: Record<string, string> }>;
  tokens?: Array<{ name: string; type: string; title: Record<string, string> }>;
}

interface FlowCompose {
  triggers?: FlowCard[];
  conditions?: FlowCard[];
  actions?: FlowCard[];
}

function loadFlowCompose(driver: string): FlowCompose {
  const file = path.join(__dirname, '..', 'drivers', driver, 'driver.flow.compose.json');
  return JSON.parse(fs.readFileSync(file, 'utf8')) as FlowCompose;
}

function allCards(compose: FlowCompose): FlowCard[] {
  return [...(compose.triggers ?? []), ...(compose.conditions ?? []), ...(compose.actions ?? [])];
}

function expectAllLanguages(i18n: Record<string, string>, context: string) {
  for (const lang of LANGUAGES) {
    expect(i18n[lang], `${context} is missing language '${lang}'`).toBeTruthy();
  }
}

describe.each(DRIVERS)('driver %s flow compose', (driver) => {
  const compose = loadFlowCompose(driver);

  it('defines at least one trigger and one action', () => {
    expect(compose.triggers?.length ?? 0).toBeGreaterThan(0);
    expect(compose.actions?.length ?? 0).toBeGreaterThan(0);
  });

  it('has all languages for every title, arg, token and titleFormatted', () => {
    for (const card of allCards(compose)) {
      expectAllLanguages(card.title, `${driver}/${card.id}.title`);
      if (card.titleFormatted) {
        expectAllLanguages(card.titleFormatted, `${driver}/${card.id}.titleFormatted`);
      }
      for (const arg of card.args ?? []) {
        if (arg.title) expectAllLanguages(arg.title, `${driver}/${card.id}.args.${arg.name}`);
      }
      for (const token of card.tokens ?? []) {
        expectAllLanguages(token.title, `${driver}/${card.id}.tokens.${token.name}`);
      }
    }
  });

  it('provides titleFormatted for every card with arguments', () => {
    for (const card of allCards(compose)) {
      if ((card.args ?? []).length > 0) {
        expect(
          card.titleFormatted,
          `${driver}/${card.id} has args but no titleFormatted`,
        ).toBeDefined();
        for (const arg of card.args ?? []) {
          expect(
            card.titleFormatted?.en,
            `${driver}/${card.id}.titleFormatted.en must reference [[${arg.name}]]`,
          ).toContain(`[[${arg.name}]]`);
        }
      }
    }
  });

  it('gives every changed-trigger both value and previous tokens', () => {
    for (const trigger of compose.triggers ?? []) {
      if (trigger.id.endsWith('_changed') || trigger.id.endsWith('_toggled')) {
        const names = (trigger.tokens ?? []).map((t) => t.name);
        expect(names, `${driver}/${trigger.id} tokens`).toEqual(
          expect.arrayContaining(['value', 'previous']),
        );
      }
    }
  });
});
