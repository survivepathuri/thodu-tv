import React, {createContext, useContext} from 'react';
import type {Lang} from '../core';

/** Speaks text aloud. The app supplies a real engine; the default is silent. */
export type SpeakFn = (text: string, lang: Lang) => void;

const SpeechContext = createContext<SpeakFn>(() => {});

export const SpeechProvider = ({
  speak,
  children,
}: {
  speak: SpeakFn;
  children: React.ReactNode;
}) => <SpeechContext.Provider value={speak}>{children}</SpeechContext.Provider>;

export const useSpeak = () => useContext(SpeechContext);
