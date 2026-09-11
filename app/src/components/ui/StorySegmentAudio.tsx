import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { AudioSegmentSource } from '../../../shared/story-audio-segments';
import { useAppLock } from '../../hooks/useAppLock';
import { useStoryAudio } from '../../hooks/useStoryAudio';
import { getStoryAudioPageUrl, loadStoryAudioSegment, type StoryAudioSegment } from '../../lib/story-audio';

export function StorySegmentAudio({ sources, labels }: { sources: AudioSegmentSource[]; labels: string[] }) {
  const location = useLocation();
  const identity = JSON.stringify(sources);
  return <SegmentAudioSession key={`${location.key}:${identity}`} sources={sources} labels={labels} />;
}

function SegmentAudioSession({ sources, labels }: { sources: AudioSegmentSource[]; labels: string[] }) {
  const { locked } = useAppLock();
  const { play, stop, pause, resume, isPlaying, isPaused, isStudioAudio, error, activeCue } = useStoryAudio(!locked);
  const [selected, setSelected] = useState<number | null>(null);
  const [assets, setAssets] = useState<(StoryAudioSegment | null)[]>([]);
  // A session is keyed by the exact content, age, stage and route. Never start audio in an effect.
  const [initialSources] = useState(sources);
  useEffect(() => {
    let cancelled = false;
    void Promise.all(initialSources.map(source => loadStoryAudioSegment(source)))
      .then(result => { if (!cancelled) setAssets(result); });
    return () => { cancelled = true; stop(); };
  }, [initialSources, stop]);
  if (!sources.length) return null;
  return <div className="rounded-[var(--radius-card)] bg-cream p-3 text-navy">
    <div className="flex flex-wrap gap-2">
      {sources.map((source, index) => <button
        key={source.segmentId}
        type="button"
        disabled={locked}
        className="min-h-11 rounded-full bg-sand px-4 py-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-blue disabled:opacity-50"
        onClick={() => {
          if (selected === index && isPlaying) { pause(); return; }
          if (selected === index && isPaused) { resume(); return; }
          const asset = assets[index];
          setSelected(index);
          play({ text: source.text, url: asset ? getStoryAudioPageUrl(asset) : undefined, durationMs: asset?.durationMs, cues: asset?.cues });
        }}
      >
        {selected === index && isPlaying ? 'Pausar' : selected === index && isPaused ? 'Retomar' : 'Ouvir'} {labels[index]}
      </button>)}
      {(isPlaying || isPaused) && <button type="button" onClick={stop} className="min-h-11 rounded-full px-3 text-sm font-bold underline">Parar áudio</button>}
    </div>
    <p role="status" className="mt-2 text-xs leading-relaxed">
      {error ?? (isPaused ? 'Áudio pausado. Toque para retomar.' : isPlaying
        ? isStudioAudio ? 'Ouvindo voz de estúdio.' : 'Ouvindo a voz brasileira do aparelho.'
        : 'Toque para ouvir ou leia em silêncio. Sem estúdio aprovado, usamos somente a voz brasileira do aparelho.')}
    </p>
    {selected !== null && (isPlaying || isPaused) && <p className="mt-2 text-sm leading-relaxed">
      {activeCue ? <>
        {sources[selected].text.slice(0, activeCue.characterStart)}
        <mark className="rounded bg-yellow/45 text-inherit">{sources[selected].text.slice(activeCue.characterStart, activeCue.characterEnd)}</mark>
        {sources[selected].text.slice(activeCue.characterEnd)}
      </> : sources[selected].text}
    </p>}
  </div>;
}
