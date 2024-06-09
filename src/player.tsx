import '@vidstack/react/player/styles/base.css';

import { useEffect, useRef, useState } from 'react';

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from '@vidstack/react';

import { VideoLayout } from './components/layouts/video-layout';
import { textTracks } from './tracks';

export function Player() {
  let player = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {
      // console.log('is paused?', '->', state.paused);
      // console.log('is audio view?', '->', state.viewType === 'audio');
    });
  }, []);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent,
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.
  function onCanPlay(detail: MediaCanPlayDetail, nativeEvent: MediaCanPlayEvent) {
    // ...
  }

  interface Source {
    file: string;
    label: string;
    default: boolean;
    type: string;
  }

  interface Track {
    // Define the properties for track if there are any
  }

  interface Advertising {
    // Define the properties for advertising if there are any
  }

  interface VideoData {
    source: Source[];
    source_bk: Source[];
    track: Track[];
    advertising: Advertising[];
    linkiframe: string;
  }

  const [data, setData] = useState<VideoData>();

  useEffect(() => {
    async function fetchData() {
        try {
            const response = await fetch('https://proxy.gojo.live/?url=https://azal-api.vercel.app/sources/exhuma-2024-episode-1.html');
            const result: VideoData = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching the data:', error);
        }
    }

    fetchData();
}, []);

  return (
    <MediaPlayer
      className="w-full aspect-video bg-slate-900 text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4"
      title="Exhuma"
      src={data?.source[0]?.file}
      crossOrigin
      playsInline
      onProviderChange={onProviderChange}
      onCanPlay={onCanPlay}
      ref={player}
    >
      <MediaProvider>
        <Poster
          className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
          src="https://image.tmdb.org/t/p/original/m8k1rFB68IZmIUoJfpnboY4taVg.jpg"
          alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
        />
        {/* {textTracks.map((track) => (
          <Track {...track} key={track.src} />
        ))} */}
      </MediaProvider>

      <VideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" />
    </MediaPlayer>
  );
}
