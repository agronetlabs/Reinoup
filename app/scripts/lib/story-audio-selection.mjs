import { storyAudioInventory } from '../../shared/story-audio-segments.ts';

export function selectAudioSources(stories, args, { generation = false } = {}) {
  const flags = new Set(['--dry-run', ...(generation ? ['--force'] : [])]);
  const values = new Set(['--story', '--season', '--through-order', '--age', '--chapter', '--page', '--scope']);
  const options = {};
  for (let index = 0; index < args.length; index++) {
    const name = args[index];
    if (name === '--') continue;
    if ((!flags.has(name) && !values.has(name)) || name in options) throw new Error(`Opção desconhecida ou repetida: ${name}`);
    if (flags.has(name)) options[name] = true;
    else {
      const value = args[++index];
      if (!value?.trim() || value.startsWith('--')) throw new Error(`Valor ausente: ${name}`);
      options[name] = value;
    }
  }
  const age = options['--age'];
  const scope = options['--scope'] ?? 'all';
  const order = options['--through-order'] === undefined ? undefined : Number(options['--through-order']);
  const page = options['--page'] === undefined ? undefined : Number(options['--page']);
  if (age && !['5-7', '8-10'].includes(age)) throw new Error('--age deve ser 5-7 ou 8-10');
  if (!['all', 'pages', 'segments'].includes(scope)) throw new Error('--scope deve ser all, pages ou segments');
  if (order !== undefined && (!Number.isInteger(order) || order < 1 || !options['--season'])) throw new Error('--through-order requer inteiro positivo e --season');
  if (page !== undefined && (!Number.isInteger(page) || page < 1 || !options['--chapter'])) throw new Error('--page requer inteiro positivo e --chapter');
  const selected = stories.filter(story => (!options['--story'] || story.id === options['--story'])
    && (!options['--season'] || story.seasonId === options['--season']) && (order === undefined || story.order <= order));
  const sources = selected.flatMap(story => (age ? [age] : ['5-7', '8-10']).flatMap(ageBand => storyAudioInventory(story, ageBand)))
    .filter(source => (scope === 'all' || (scope === 'pages' ? source.pageIndex !== undefined : source.pageIndex === undefined))
      && (!options['--chapter'] || source.chapterId === options['--chapter'] || source.segmentId.startsWith(`${options['--chapter']}-choice-`))
      && (page === undefined || source.pageIndex === page - 1));
  if (!sources.length) throw new Error('Seleção desconhecida ou vazia: nenhum áudio corresponde aos filtros.');
  return { sources, dryRun: !!options['--dry-run'], force: !!options['--force'] };
}

export function printAudioInventory(sources) {
  for (const source of sources) console.log(`${source.storyId} / ${source.ageBand} / ${source.segmentId} / ${source.role} / ${source.text.length} caracteres`);
  const pages = sources.filter(source => source.pageIndex !== undefined).length;
  console.log(`Dry-run: ${sources.length} entradas · ${pages} páginas · ${sources.length - pages} segmentos · ${sources.reduce((sum, source) => sum + source.text.length, 0)} caracteres de texto (não é estimativa de créditos).`);
}
