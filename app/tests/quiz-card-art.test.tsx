import { describe, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { APPROVED_QUIZ_CARD_ART, GN02_QUIZ_CARD_ART, getApprovedQuizCardArt } from '../shared/quiz-card-art';
import { quizCardPrompt, selectQuizCardArt } from '../scripts/generate-gn02-quiz-art.mjs';
import { STORY_ART_STYLE_PROMPT, STORY_ART_REFERENCE_PROMPT, STORY_ART_STYLE_REVISION } from '../scripts/lib/story-art-style.mjs';

describe('first four 3D quiz cards', () => {
  test('the authorized sample batch covers each q2 answer exactly once', () => {
    expect(GN02_QUIZ_CARD_ART.map(art => art.optionIndex)).toEqual([0, 1, 2, 3]);
    expect(new Set(GN02_QUIZ_CARD_ART.map(art => art.id)).size).toBe(4);
    expect(GN02_QUIZ_CARD_ART[1].alt).toContain('Pães');
    expect(GN02_QUIZ_CARD_ART[2].alt).toContain('rio');
    expect(GN02_QUIZ_CARD_ART[3].alt).toContain('alimento');
  });

  test('drafts are not published or requested by the app before visual approval', () => {
    expect(APPROVED_QUIZ_CARD_ART).toEqual([]);
    for (let index = 0; index < 4; index++) {
      expect(getApprovedQuizCardArt('gn-02-adao-eva', 'gn-02-q2', index)).toBeUndefined();
    }
    expect(getApprovedQuizCardArt('gn-01-criacao', 'gn-02-q2', 0)).toBeUndefined();
  });

  test('generation defaults to dry-run and cannot exceed the four authorized assets', () => {
    expect(selectQuizCardArt([]).generate).toBe(false);
    expect(selectQuizCardArt(['--dry-run']).assets).toHaveLength(4);
    expect(selectQuizCardArt(['--generate', '--asset', 'gn-02-q2-pao']).assets).toHaveLength(1);
    for (const args of [
      ['--asset', 'unknown'], ['--asset'], ['--force'], ['--generate', '--dry-run'],
      ['--generate', '--generate'], ['--asset', '--generate'],
    ]) expect(() => selectQuizCardArt(args)).toThrow();
  });

  test('each prompt uses original matching art without visual answer hints', () => {
    for (const art of GN02_QUIZ_CARD_ART) {
      const prompt = quizCardPrompt(art);
      expect(prompt).toContain(art.subject);
      expect(prompt).toContain('without hinting which answer is correct');
      expect(prompt).toContain('No people, mascot, logos');
      expect(prompt).toContain(STORY_ART_STYLE_PROMPT);
      expect(prompt).toContain(STORY_ART_REFERENCE_PROMPT);
      expect(prompt).toContain('same camera distance');
    }
  });

  test('the refined quiz dry-run still contains exactly the four original answer slots', () => {
    const result = spawnSync(process.execPath, [
      fileURLToPath(new URL('../scripts/generate-gn02-quiz-art.mjs', import.meta.url)),
      '--dry-run',
    ], { encoding: 'utf8' });
    expect(result.status).toBe(0);
    const report = JSON.parse(result.stdout);
    expect(report.styleRevision).toBe(STORY_ART_STYLE_REVISION);
    expect(report.mode).toBe('dry-run');
    expect(report.model).toBe('gpt-image-2.5-sunburst');
    expect(report.count).toBe(4);
    expect(report.paidRequests).toBe(0);
    expect(report.assets.map((asset: { id: string }) => asset.id)).toEqual(GN02_QUIZ_CARD_ART.map(art => art.id));
  });

  test('only a reviewed asset resolves to its exact answer and public path', async () => {
    const source = await Bun.file(new URL('../shared/quiz-card-art.ts', import.meta.url)).text();
    const fixture = source.replace(
      'export const APPROVED_QUIZ_CARD_ART: readonly QuizCardArtApproval[] = [];',
      `export const APPROVED_QUIZ_CARD_ART: readonly QuizCardArtApproval[] = [
        { assetId: 'gn-02-q2-pao', approvalReference: 'isolated-test' },
        { assetId: 'gn-02-q2-fruto', approvalReference: ' ' },
      ];`,
    );
    expect(fixture).not.toBe(source);
    const transpiler = new Bun.Transpiler({ loader: 'ts' });
    const fixtureUrl = `data:text/javascript;base64,${Buffer.from(transpiler.transformSync(fixture)).toString('base64')}`;
    const registry: typeof import('../shared/quiz-card-art') = await import(fixtureUrl);
    expect(registry.getApprovedQuizCardArt('gn-02-adao-eva', 'gn-02-q2', 1)).toEqual({
      src: '/story-art/genesis/gn-02/quiz/gn-02-q2-pao.webp',
      alt: GN02_QUIZ_CARD_ART[1].alt,
    });
    expect(registry.getApprovedQuizCardArt('gn-02-adao-eva', 'gn-02-q2', 0)).toBeUndefined();
    expect(registry.getApprovedQuizCardArt('gn-02-adao-eva', 'gn-02-q2', 1, '/reinoup')?.src)
      .toBe('/reinoup/story-art/genesis/gn-02/quiz/gn-02-q2-pao.webp');
    expect(registry.getApprovedQuizCardArt('gn-02-adao-eva', 'gn-02-q1', 1)).toBeUndefined();
    expect(registry.getApprovedQuizCardArt('gn-02-adao-eva', 'gn-02-q2', 4)).toBeUndefined();
    const approved = registry.getApprovedQuizCardArt('gn-02-adao-eva', 'gn-02-q2', 1)!;
    expect(registry.isApprovedQuizCardImage(approved)).toBe(true);
    expect(registry.isApprovedQuizCardImage({ ...approved, alt: 'Outro alimento' })).toBe(false);
    expect(registry.isApprovedQuizCardImage({ ...approved, src: '/story-art/unreviewed.webp' })).toBe(false);
    const subpath = registry.getApprovedQuizCardArt('gn-02-adao-eva', 'gn-02-q2', 1, '/reinoup')!;
    expect(registry.isApprovedQuizCardImage(subpath, '/reinoup')).toBe(true);
    expect(registry.isApprovedQuizCardImage(subpath)).toBe(false);
  });

  test('unreviewed rasters do not load and answers retain distinct figures during migration', async () => {
    const { renderToStaticMarkup } = await import('react-dom/server');
    const { ChoiceCard } = await import('../src/components/ui/ChoiceCard');
    const illustrated = renderToStaticMarkup(
      <ChoiceCard icon="grain" image={{ src: '/story-art/genesis/gn-02/quiz/approved-test-art.webp', alt: 'Pães em uma cesta' }}>Todo o pão</ChoiceCard>,
    );
    expect(illustrated).not.toContain('<img');
    expect(illustrated).toContain('Todo o pão');
    expect(illustrated).toContain('Ilustração indisponível');
    expect(illustrated).toContain('<svg');
    expect(illustrated).toContain('data-art-status="legacy-fallback"');
    const fallback = renderToStaticMarkup(<ChoiceCard icon="grain">Todo o pão</ChoiceCard>);
    expect(fallback).not.toContain('Arte 3D em produção');
    expect(fallback).not.toContain('<img');
    expect(fallback).toContain('<svg');
    const tree = renderToStaticMarkup(<ChoiceCard icon="fruit-tree">O fruto de uma árvore</ChoiceCard>);
    expect(tree).not.toBe(fallback);
  });
});
