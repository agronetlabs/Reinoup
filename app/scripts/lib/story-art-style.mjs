import { CARD_ART_STYLE } from '../../shared/card-art-policy.ts';

export const STORY_ART_STYLE_REVISION = 'disneyclub3d-stylized-v2';

export const STORY_ART_STYLE_PROMPT = `Visual direction: ReinoUp ${CARD_ART_STYLE}, original stylized family animation, not a photograph.
Use rounded, simplified volumes, clear silhouettes and soft matte materials. Suggest fabric, bark, stone and food with a few broad details, not photographic microtexture.
Use warm diffuse light, gentle shadows and vivid balanced colors. Keep a single dominant subject or action against a quiet background made of a few broad shapes; it must remain recognizable in a small mobile card.
Avoid photorealistic still-life rendering, individual fibers and pores, gritty surfaces, excessive foliage, harsh glare and busy cinematic scenery. Preserve three-dimensional volume without flat vector clip art.
Preserve the authored lesson, character identities, ages, costumes and emotional meaning. Do not make every character smile when the story calls for concern or sorrow. Do not redesign the official mascot or copy existing studio characters.`;

export const STORY_ART_REFERENCE_PROMPT = `Use the supplied cover to preserve character identity where relevant, the warm palette and the family-friendly mood, not to copy photographic surface detail.
Simplify its textures and background according to the visual direction. Do not copy its composition or insert its garden, people or props into an unrelated lesson.`;
