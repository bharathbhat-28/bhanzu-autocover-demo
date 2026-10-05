
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Home,
  MessageSquare,
  User,
  Check,
  Calendar,
  Clock,
  Video,
  Mic,
  Camera,
  BookOpen,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

type Scenario = 'A' | 'B';

interface StepData {
  key: string;
  label: string;
  timeIST: string;
  systemEvent: string;
}

const SCENARIO_A_STEPS: StepData[] = [
  {
    key: 'T+0',
    label: 'T+0',
    timeIST: '5:00 AM IST',
    systemEvent: 'Class starts. Teacher has not joined Maverick.',
  },
  {
    key: 'T+3',
    label: 'T+3',
    timeIST: '5:03 AM IST',
    systemEvent: "Bot messaged the teacher on WhatsApp: 'Are you joining now?'",
  },
  {
    key: 'T+5',
    label: 'T+5',
    timeIST: '5:05 AM IST',
    systemEvent: 'No join, no reply. Substitute request sent on WhatsApp to eligible teachers.',
  },
  {
    key: 'T+8',
    label: 'T+8',
    timeIST: '5:08 AM IST',
    systemEvent: 'Ms. Priya accepted the request.',
  },
  {
    key: 'T+11',
    label: 'T+11',
    timeIST: '5:11 AM IST',
    systemEvent: 'Ms. Priya joined Maverick.',
  },
];

const SCENARIO_B_STEPS: StepData[] = [
  {
    key: 'T+0',
    label: 'T+0',
    timeIST: '5:00 AM IST',
    systemEvent: 'Class starts. Teacher has not joined Maverick.',
  },
  {
    key: 'T+3',
    label: 'T+3',
    timeIST: '5:03 AM IST',
    systemEvent: "Bot messaged the teacher on WhatsApp: 'Are you joining now?'",
  },
  {
    key: 'T+5',
    label: 'T+5',
    timeIST: '5:05 AM IST',
    systemEvent: 'No join, no reply. Substitute request sent on WhatsApp to eligible teachers.',
  },
  {
    key: 'T+12',
    label: 'T+12',
    timeIST: '5:12 AM IST',
    systemEvent: 'No teacher accepted in time. Ops alerted, parent informed, rebook flow started.',
  },
];

const MAKE_UP_SLOTS = [
  'Wed, 7 Oct - 5:00 AM IST',
  'Fri, 9 Oct - 5:00 AM IST',
  'Sat, 10 Oct - 6:00 AM IST',
];

export default function App() {
  const [scenario, setScenario] = useState<Scenario>('A');
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Student Screen interactive state
  const [puzzleAnswer, setPuzzleAnswer] = useState<number | null>(null);
  const [studentHomeView, setStudentHomeView] = useState<boolean>(false);

  // Parent App interactive state
  const [parentView, setParentView] = useState<'home' | 'picker' | 'confirmation'>('home');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [confirmedSlot, setConfirmedSlot] = useState<string | null>(null);

  const activeSteps = scenario === 'A' ? SCENARIO_A_STEPS : SCENARIO_B_STEPS;
  const currentStep = activeSteps[stepIndex] || activeSteps[0];

  // Auto-advance play mode with 2-second pause between steps
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setStepIndex((prev) => {
        if (prev + 1 < activeSteps.length) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, activeSteps.length]);

  // Scenario toggle handler - resets to first step
  const handleScenarioChange = (newScenario: Scenario) => {
    setScenario(newScenario);
    setStepIndex(0);
    setIsPlaying(false);
    resetLocalStates();
  };

  const resetLocalStates = () => {
    setPuzzleAnswer(null);
    setStudentHomeView(false);
    setParentView('home');
    setSelectedSlot(null);
    setConfirmedSlot(null);
  };

  const handleReset = () => {
    setStepIndex(0);
    setIsPlaying(false);
    resetLocalStates();
  };

  const handleStepClick = (index: number) => {
    setStepIndex(index);
    setIsPlaying(false);
    // When moving away from T+12 or T+0 reset specific sub-views
    if (index === 0) {
      resetLocalStates();
    } else {
      setStudentHomeView(false);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
      setIsPlaying(false);
      setStudentHomeView(false);
    }
  };

  const handleNext = () => {
    if (stepIndex < activeSteps.length - 1) {
      setStepIndex((prev) => prev + 1);
      setIsPlaying(false);
      setStudentHomeView(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* 1. TOP BAR: DEMO CONTROLS */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 shadow-xs sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-indigo-900 tracking-tight">AutoCover Demo</h1>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-md border border-indigo-100">
              Product-Manager Case Study
            </span>
          </div>

          {/* Scenario Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => handleScenarioChange('A')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                scenario === 'A'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              A: Substitute accepts
            </button>
            <button
              onClick={() => handleScenarioChange('B')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                scenario === 'B'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              B: Nobody accepts
            </button>
          </div>

          {/* Clock Label & Timeline Stepper */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Visible clock label */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-900 text-white rounded-md text-xs font-bold font-mono tracking-wide shadow-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-300" />
              <span>{currentStep.label}</span>
              <span className="text-indigo-300 font-normal">({currentStep.timeIST})</span>
            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {activeSteps.map((step, idx) => (
                <button
                  key={step.key}
                  onClick={() => handleStepClick(idx)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    idx === stepIndex
                      ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title={`${step.label} (${step.timeIST})`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {/* Navigation buttons: Back, Next, Play, Reset */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                disabled={stepIndex === 0}
                className="p-1.5 text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={stepIndex === activeSteps.length - 1}
                className="p-1.5 text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
                title={isPlaying ? 'Pause auto-play' : 'Play 2s auto-advance'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                title="Reset to T+0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA: DUAL FRAMES (LEFT: STUDENT VIEW, RIGHT: PARENT APP) */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1400px] mx-auto w-full flex flex-col items-center gap-6">
        <div className="w-full flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8">
          
          {/* LEFT: LAPTOP / BROWSER FRAME (about 720px wide) */}
          <div className="w-full xl:w-[720px] shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-sm font-bold text-slate-700">Maverick - Student view</span>
              <span className="text-xs text-slate-500 font-mono">1366 x 768 (Student Laptop)</span>
            </div>

            {/* Laptop Outer Bezel */}
            <div className="bg-slate-800 rounded-2xl p-2.5 shadow-xl border border-slate-700 flex flex-col">
              {/* Browser Window Frame */}
              <div className="bg-white rounded-xl overflow-hidden flex flex-col h-[640px] border border-slate-200 shadow-inner">
                {/* Browser Chrome Header */}
                <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-white px-4 py-1 rounded-md text-xs text-slate-500 border border-slate-200 font-mono max-w-[320px] truncate">
                    maverick.live/class/math-aarav
                  </div>
                  <div className="text-xs text-slate-400 font-medium">LIVE</div>
                </div>

                {/* Maverick Student App Header */}
                <div className="bg-indigo-900 text-white px-5 py-3 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black tracking-tight text-white">Maverick</span>
                    <span className="text-xs bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded font-medium">
                      Math Live Room
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-medium text-indigo-100">Student: Aarav</span>
                  </div>
                </div>

                {/* Maverick Student App Content Body */}
                <div className="flex-1 bg-indigo-50/40 p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
                  {/* STEP T+0: Waiting Room */}
                  {currentStep.key === 'T+0' && (
                    <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 animate-pulse text-indigo-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">Waiting for your teacher</h2>
                      <div className="text-base font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-lg mb-4">
                        Class: Math | 5:00 AM
                      </div>
                      <p className="text-sm text-slate-500 max-w-xs">
                        Your live math lesson will start automatically as soon as your teacher enters the classroom.
                      </p>
                    </div>
                  )}

                  {/* STEPS T+3 and T+5: Teacher hasn't joined + Warm-up puzzle */}
                  {(currentStep.key === 'T+3' || currentStep.key === 'T+5') && (
                    <div className="max-w-lg w-full bg-white rounded-2xl p-7 border border-slate-200 shadow-sm flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                        <Clock className="w-6 h-6" />
                      </div>
                      
                      {/* Exact copy */}
                      <p className="text-lg font-semibold text-slate-800 mb-6 text-center leading-relaxed">
                        Hi Aarav! Your teacher hasn't joined yet. We're finding help, usually in a few minutes.
                      </p>

                      {/* Small warm-up puzzle */}
                      <div className="w-full bg-indigo-50/70 border border-indigo-100 rounded-xl p-5 flex flex-col items-center">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span>Quick Warm-Up</span>
                        </div>

                        {/* Exact copy */}
                        <h3 className="text-xl font-bold text-slate-900 mb-4">What is 7 x 8?</h3>

                        {/* Options: 54, 56, 64 */}
                        <div className="flex items-center justify-center gap-3 w-full max-w-xs mb-3">
                          {[54, 56, 64].map((option) => {
                            const isSelected = puzzleAnswer === option;
                            const isCorrect = option === 56;
                            return (
                              <button
                                key={option}
                                onClick={() => setPuzzleAnswer(option)}
                                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-base transition-all border ${
                                  isSelected
                                    ? isCorrect
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                      : 'bg-rose-500 text-white border-rose-500 shadow-sm'
                                    : 'bg-white text-slate-800 border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {/* Immediate Feedback */}
                        {puzzleAnswer !== null && (
                          <div
                            className={`text-sm font-bold px-3 py-1 rounded-md transition-all ${
                              puzzleAnswer === 56
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {puzzleAnswer === 56 ? 'Nice one!' : 'Try again!'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SCENARIO A - STEP T+8: Ms. Priya accepted */}
                  {scenario === 'A' && currentStep.key === 'T+8' && (
                    <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 stroke-[3]" />
                      </div>
                      
                      {/* Exact copy */}
                      <h2 className="text-xl font-bold text-slate-900 mb-4 leading-snug">
                        Good news! Ms. Priya is your teacher today. She will join in a few minutes.
                      </h2>

                      <div className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3 text-left">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-base shrink-0">
                          MP
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">Ms. Priya</div>
                          <div className="text-xs text-indigo-700">Substitute Teacher · Math</div>
                          <div className="text-xs text-slate-500 mt-0.5">Connecting audio and video...</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCENARIO A - STEP T+11: Class in progress with Ms. Priya */}
                  {scenario === 'A' && currentStep.key === 'T+11' && (
                    <div className="w-full h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                      {/* Class in progress header */}
                      <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h2 className="text-base font-bold text-slate-900">
                            Class in progress with Ms. Priya
                          </h2>
                        </div>
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                          05:11 IST
                        </span>
                      </div>

                      {/* Simple Lesson Placeholder Area */}
                      <div className="flex-1 p-4 grid grid-cols-3 gap-3 bg-slate-50">
                        {/* Whiteboard Area (2 cols) */}
                        <div className="col-span-2 bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between shadow-xs">
                          <div>
                            <div className="text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Lesson Plan: Math</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Mental Multiplication & Tricks</h3>
                            <div className="mt-3 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs text-slate-700 space-y-1.5 text-left font-mono">
                              <div>&bull; 7 x 8 = 56 (Recap)</div>
                              <div>&bull; 12 x 5 = 60</div>
                              <div>&bull; Problem 1: 15 x 6 = ?</div>
                            </div>
                          </div>
                          <div className="text-xs text-slate-400 text-left border-t border-slate-100 pt-2">
                            Interactive Whiteboard · Ms. Priya is presenting
                          </div>
                        </div>

                        {/* Teacher & Student Feeds (1 col) */}
                        <div className="col-span-1 flex flex-col gap-3">
                          {/* Teacher Camera feed */}
                          <div className="flex-1 bg-slate-800 rounded-lg p-2 flex flex-col justify-between text-white relative overflow-hidden">
                            <div className="w-full flex justify-end">
                              <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded font-medium">Teacher</span>
                            </div>
                            <div className="flex flex-col items-center my-auto">
                              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-sm">
                                MP
                              </div>
                              <span className="text-xs font-semibold mt-1">Ms. Priya</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-300">
                              <span className="flex items-center gap-1">
                                <Mic className="w-3 h-3 text-emerald-400" /> Live
                              </span>
                            </div>
                          </div>

                          {/* Student Camera feed */}
                          <div className="h-24 bg-slate-700 rounded-lg p-2 flex flex-col justify-between text-white">
                            <div className="flex items-center justify-between text-[10px]">
                              <span>Aarav</span>
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            </div>
                            <div className="text-center text-xs text-slate-300">Camera active</div>
                          </div>
                        </div>
                      </div>

                      {/* Call Controls Bar */}
                      <div className="bg-slate-900 px-4 py-2 flex items-center justify-center gap-3">
                        <button className="p-2 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-colors">
                          <Mic className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-full bg-slate-700 text-white hover:bg-slate-600 transition-colors">
                          <Camera className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors">
                          <Video className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SCENARIO B - STEP T+12: Class cancelled */}
                  {scenario === 'B' && currentStep.key === 'T+12' && (
                    <>
                      {!studentHomeView ? (
                        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col items-center">
                          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                            <HelpCircle className="w-8 h-8" />
                          </div>

                          {/* Exact copy */}
                          <p className="text-lg font-bold text-slate-900 mb-6 text-center leading-relaxed">
                            Sorry, Aarav. Today's class can't happen. Your parents have been told and will pick a new time.
                          </p>

                          {/* Exact copy button */}
                          <button
                            onClick={() => setStudentHomeView(true)}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
                          >
                            Back to home
                          </button>
                        </div>
                      ) : (
                        /* Simple home screen with exact text */
                        <div className="max-w-md w-full bg-white rounded-2xl p-10 border border-slate-200 shadow-sm flex flex-col items-center">
                          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                            <Home className="w-8 h-8" />
                          </div>
                          
                          {/* Exact copy */}
                          <h2 className="text-2xl font-bold text-slate-900 mb-2">See you next class!</h2>
                          <p className="text-sm text-slate-500 mb-6">
                            Your math class will be rescheduled by your parents shortly. Have a great day!
                          </p>

                          <button
                            onClick={() => setStudentHomeView(false)}
                            className="text-xs text-indigo-600 font-semibold hover:underline"
                          >
                            Return to message
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PHONE FRAME (about 375x780) */}
          <div className="w-[375px] shrink-0 flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-sm font-bold text-slate-700">Parent app</span>
              <span className="text-xs text-slate-500 font-mono">375 x 780 (Mobile)</span>
            </div>

            {/* Phone Outer Shell */}
            <div className="bg-slate-900 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 h-[740px] flex flex-col relative overflow-hidden">
              {/* Phone Inner Screen */}
              <div className="bg-slate-50 rounded-[34px] flex-1 flex flex-col overflow-hidden relative border border-slate-800">
                {/* Status Bar / Dynamic Notch Area */}
                <div className="bg-white pt-2.5 px-6 pb-2 flex items-center justify-between text-xs text-slate-900 font-semibold z-20 shrink-0">
                  <span>5:00</span>
                  <div className="w-20 h-4 bg-slate-900 rounded-full" />
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-slate-800 rounded-xs p-0.5">
                      <div className="h-full bg-slate-800 rounded-2xs w-full" />
                    </div>
                  </div>
                </div>

                {/* Bhanzu App Header */}
                <div className="bg-white px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <div>
                    <span className="text-lg font-bold text-indigo-900 tracking-tight">Bhanzu</span>
                    <span className="block text-[11px] text-slate-400 font-medium">Parent Portal</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-800">Mon, 5 Oct</span>
                  </div>
                </div>

                {/* WHATSAPP NOTIFICATION BANNER (Slides in at top of phone) */}
                {/* Scenario A, T+8 & T+11 */}
                {scenario === 'A' && (currentStep.key === 'T+8' || currentStep.key === 'T+11') && (
                  <div className="mx-3 mt-2 mb-1 p-3 bg-white rounded-2xl shadow-md border-l-4 border-emerald-500 border border-slate-200 animate-in slide-in-from-top-4 duration-300 z-30">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                        <MessageSquare className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                        <span>WhatsApp · just now</span>
                      </div>
                    </div>
                    {/* Exact copy */}
                    <p className="text-xs text-slate-800 leading-snug font-medium">
                      Aarav's 5:00 AM class is on. Ms. Priya will teach it today, with his lesson plan. Nothing for you to do.
                    </p>
                  </div>
                )}

                {/* Scenario B, T+12 (Tapping opens picker screen!) */}
                {scenario === 'B' && currentStep.key === 'T+12' && parentView === 'home' && confirmedSlot === null && (
                  <div
                    onClick={() => setParentView('picker')}
                    className="mx-3 mt-2 mb-1 p-3 bg-white rounded-2xl shadow-md border-l-4 border-amber-500 border border-slate-200 cursor-pointer hover:bg-amber-50/30 transition-all animate-in slide-in-from-top-4 duration-300 z-30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
                        <MessageSquare className="w-3.5 h-3.5 fill-amber-600 text-white" />
                        <span>WhatsApp · Action required</span>
                      </div>
                      <span className="text-[10px] text-indigo-600 font-semibold underline">Tap to pick</span>
                    </div>
                    {/* Exact copy */}
                    <p className="text-xs text-slate-800 leading-snug font-medium">
                      We're sorry. Aarav's 5:00 AM class can't go ahead today, and no cover teacher was available. Pick a make-up time in one tap.
                    </p>
                  </div>
                )}

                {/* PHONE SCREEN CONTENT: Home / Picker / Confirmation */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                  {/* VIEW 1: HOME */}
                  {parentView === 'home' && (
                    <div className="flex flex-col gap-4">
                      {/* Greeting */}
                      <div>
                        <h2 className="text-base font-bold text-slate-900">Good morning!</h2>
                        <p className="text-xs text-slate-500">Student: Aarav · Grade 4 Math</p>
                      </div>

                      {/* Upcoming section */}
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Upcoming Classes
                        </div>

                        {/* CASE 1: Steps T+0, T+3, T+5 (Scenario A or B) */}
                        {(currentStep.key === 'T+0' || currentStep.key === 'T+3' || currentStep.key === 'T+5') && (
                          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-900">Math</span>
                              {/* Green status */}
                              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Confirmed
                              </span>
                            </div>
                            {/* Exact copy card */}
                            <p className="text-sm font-semibold text-slate-800">
                              Aarav - Math - Today 5:00 AM - Confirmed
                            </p>
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-100">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Mon, 5 Oct · 5:00 AM IST</span>
                            </div>
                          </div>
                        )}

                        {/* CASE 2: Scenario A, T+8 & T+11 (Teacher changed to Ms. Priya) */}
                        {scenario === 'A' && (currentStep.key === 'T+8' || currentStep.key === 'T+11') && (
                          <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-900">Math</span>
                              {/* Blue status */}
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                                Teacher changed
                              </span>
                            </div>
                            {/* Exact copy card */}
                            <p className="text-sm font-semibold text-slate-800">
                              Aarav - Math - Today 5:00 AM - Teacher changed to Ms. Priya
                            </p>
                            <div className="text-xs text-sky-700 bg-sky-50/80 px-2.5 py-1 rounded-lg border border-sky-100 flex items-center justify-between">
                              <span>Substitute: Ms. Priya</span>
                              <span className="font-semibold">Lesson on track</span>
                            </div>
                          </div>
                        )}

                        {/* CASE 3: Scenario B, T+12 (Before make-up confirmed) */}
                        {scenario === 'B' && currentStep.key === 'T+12' && confirmedSlot === null && (
                          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-900">Math</span>
                              {/* Orange status */}
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                Make-up pending
                              </span>
                            </div>
                            {/* Class card info */}
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                Aarav - Math - Today 5:00 AM
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Teacher unavailable. Reschedule at no charge.
                              </p>
                            </div>
                            {/* Exact copy button: "Pick a time" */}
                            <button
                              onClick={() => setParentView('picker')}
                              className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors text-center"
                            >
                              Pick a time
                            </button>
                          </div>
                        )}

                        {/* CASE 4: Scenario B, T+12 (After make-up confirmed) */}
                        {scenario === 'B' && currentStep.key === 'T+12' && confirmedSlot !== null && (
                          <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-xs flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-900">Math</span>
                              {/* Green status */}
                              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Confirmed
                              </span>
                            </div>
                            {/* Exact copy format: "Make-up class - [chosen slot] - Confirmed" */}
                            <p className="text-sm font-semibold text-slate-800">
                              Make-up class - {confirmedSlot} - Confirmed
                            </p>
                            <div className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center justify-between">
                              <span>Rebooked by parent</span>
                              <span className="font-semibold">All set</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Additional helpful parent context card */}
                      <div className="bg-indigo-50/60 rounded-xl p-3 border border-indigo-100 text-xs text-slate-600">
                        <div className="font-semibold text-indigo-900 mb-1">Aarav's Learning Schedule</div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Classes run 2x weekly with Bhanzu live interactive curriculum.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: MAKE-UP PICKER SCREEN */}
                  {parentView === 'picker' && (
                    <div className="flex flex-col h-full">
                      {/* Back button header */}
                      <button
                        onClick={() => setParentView('home')}
                        className="flex items-center gap-1 text-xs text-indigo-700 font-semibold mb-3 hover:text-indigo-900 self-start"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>

                      {/* Exact title & subtitle */}
                      <h2 className="text-base font-bold text-slate-900">Pick a make-up time</h2>
                      <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                        Matches Aarav's preferred window, outside school hours
                      </p>

                      {/* Exactly 3 slot cards */}
                      <div className="flex flex-col gap-2.5 mb-6">
                        {MAKE_UP_SLOTS.map((slot) => {
                          const isSelected = selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-indigo-50/90 border-indigo-600 ring-2 ring-indigo-600/20 shadow-xs'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Calendar className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                                <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-950 font-bold' : 'text-slate-700'}`}>
                                  {slot}
                                </span>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Exact button: "Confirm" */}
                      <div className="mt-auto">
                        <button
                          disabled={!selectedSlot}
                          onClick={() => setParentView('confirmation')}
                          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VIEW 3: CONFIRMATION SCREEN */}
                  {parentView === 'confirmation' && (
                    <div className="flex flex-col items-center justify-center h-full text-center px-2">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                        <Check className="w-7 h-7 stroke-[3]" />
                      </div>

                      {/* Exact copy */}
                      <h2 className="text-lg font-bold text-slate-900 mb-2">Make-up class booked</h2>
                      
                      {/* Chosen slot */}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 my-3 w-full">
                        <span className="text-xs font-bold text-indigo-900">{selectedSlot}</span>
                      </div>

                      <p className="text-xs text-slate-500 mb-6">
                        Aarav's tutor has been notified and his lesson materials are synchronized.
                      </p>

                      {/* Exact copy button: "Done" */}
                      <button
                        onClick={() => {
                          setConfirmedSlot(selectedSlot);
                          setParentView('home');
                        }}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>

                {/* BOTTOM TAB BAR (Home, Chat, Profile) */}
                <div className="bg-white border-t border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0">
                  {/* Home Tab (functional active) */}
                  <button
                    onClick={() => setParentView('home')}
                    className="flex flex-col items-center gap-1 text-indigo-600"
                  >
                    <Home className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Home</span>
                  </button>

                  {/* Chat Tab (non-functional placeholder) */}
                  <div className="flex flex-col items-center gap-1 text-slate-400 opacity-60 cursor-not-allowed">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Chat</span>
                  </div>

                  {/* Profile Tab (non-functional placeholder) */}
                  <div className="flex flex-col items-center gap-1 text-slate-400 opacity-60 cursor-not-allowed">
                    <User className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Profile</span>
                  </div>
                </div>

                {/* Phone Home Bar Indicator */}
                <div className="bg-white pb-1 pt-0.5 flex justify-center shrink-0">
                  <div className="w-28 h-1 bg-slate-300 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. BELOW THE FRAMES: "What the system just did:" */}
        <div className="w-full max-w-[1120px] bg-white border border-slate-200 rounded-xl px-5 py-3.5 shadow-xs flex items-center gap-3">
          <span className="text-xs font-bold text-slate-900 shrink-0">
            What the system just did:
          </span>
          <span className="text-xs font-medium text-indigo-900 bg-indigo-50/80 border border-indigo-100 px-3 py-1 rounded-md">
            {currentStep.systemEvent}
          </span>
        </div>
      </main>
    </div>
  );
}
