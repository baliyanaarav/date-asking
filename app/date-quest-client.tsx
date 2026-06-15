"use client";

import {
  CalendarDays,
  Check,
  Clock,
  Copy,
  Heart,
  MapPin,
  MessageCircleHeart,
  Music2,
  PartyPopper,
  Sparkles,
  Utensils,
} from "lucide-react";
import { useMemo, useState } from "react";

type Choice = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

type StepId = "mood" | "place" | "date" | "answer";

const senderName = "Aarav";
const whatsAppNumber = "918791598500";

const moods: Choice[] = [
  {
    id: "sweet",
    title: "Sweet & cozy",
    subtitle: "Soft lights, calm music, easy smiles.",
    icon: Heart,
  },
  {
    id: "adventure",
    title: "Tiny adventure",
    subtitle: "A little exploring before the food arrives.",
    icon: MapPin,
  },
  {
    id: "fancy",
    title: "Dress-up lovely",
    subtitle: "A polished plan with a little sparkle.",
    icon: Sparkles,
  },
];

const places: Choice[] = [
  {
    id: "cafe",
    title: "Cafe + dessert",
    subtitle: "Coffee, cake, and a table we do not rush.",
    icon: Utensils,
  },
  {
    id: "dinner",
    title: "Dinner date",
    subtitle: "Good food, warm lights, proper date energy.",
    icon: CalendarDays,
  },
  {
    id: "movie",
    title: "Movie + snacks",
    subtitle: "Popcorn, opinions, and a walk after.",
    icon: Music2,
  },
  {
    id: "walk",
    title: "Walk + street food",
    subtitle: "Simple, cute, and dangerously easy to enjoy.",
    icon: MapPin,
  },
];

const timeSlots = ["5:30 PM", "6:30 PM", "7:30 PM", "8:30 PM"];

const steps: StepId[] = ["mood", "place", "date", "answer"];

const noButtonSpots = [
  { x: 18, y: 18 },
  { x: 82, y: 18 },
  { x: 18, y: 82 },
  { x: 82, y: 82 },
];

function getTodayValue() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const local = new Date(today.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  if (!value) return "a date she chooses";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatTimeValue(value: string) {
  const [hourText, minuteText] = value.split(":");
  const hours = Number(hourText);
  const minutes = Number(minuteText);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "";

  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function choiceTitle(choices: Choice[], id: string) {
  return choices.find((choice) => choice.id === id)?.title ?? "";
}

export default function DateQuest({ initialName }: { initialName: string }) {
  const recipientName = initialName;
  const [step, setStep] = useState<StepId>("mood");
  const [mood, setMood] = useState(moods[0].id);
  const [place, setPlace] = useState(places[0].id);
  const [date, setDate] = useState(getTodayValue);
  const [time, setTime] = useState(timeSlots[1]);
  const [customTime, setCustomTime] = useState("");
  const [noPosition, setNoPosition] = useState(noButtonSpots[1]);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [showConfetti, setShowConfetti] = useState(false);

  const todayValue = useMemo(() => getTodayValue(), []);
  const currentIndex = steps.indexOf(step);
  const heroTitle = recipientName
    ? `${recipientName}, want to go on a date?`
    : "Want to go on a date?";
  const finalTitle = recipientName
    ? `So, ${recipientName}, is it a date?`
    : "So, is it a date?";

  const responseMessage = useMemo(() => {
    const moodTitle = choiceTitle(moods, mood).toLowerCase();
    const placeTitle = choiceTitle(places, place).toLowerCase();
    return [
      `Yes, ${senderName}.`,
      "I say yes to the date.",
      `Vibe: ${moodTitle}`,
      `Plan: ${placeTitle}`,
      `Date: ${formatDate(date)}`,
      `Time: ${time}`,
      "You can pick me up, or we can meet somewhere comfortable.",
      "Plan it nicely and be on time.",
    ].join("\n");
  }, [date, mood, place, time]);
  const whatsAppResponseUrl = useMemo(
    () => `https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(responseMessage)}`,
    [responseMessage],
  );

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("idle");
    }
  }

  function moveNoButton() {
    setNoPosition((position) => {
      const availableSpots = noButtonSpots.filter(
        (spot) => Math.abs(spot.x - position.x) > 10 || Math.abs(spot.y - position.y) > 10,
      );
      return availableSpots[Math.floor(Math.random() * availableSpots.length)] ?? noButtonSpots[0];
    });
  }

  function nextStep() {
    const next = steps[Math.min(currentIndex + 1, steps.length - 1)];
    setStep(next);
  }

  function selectPresetTime(slot: string) {
    setCustomTime("");
    setTime(slot);
  }

  function selectCustomTime(value: string) {
    setCustomTime(value);
    const formattedTime = formatTimeValue(value);
    if (formattedTime) setTime(formattedTime);
  }

  async function celebrateYes() {
    setShowConfetti(true);
    window.setTimeout(() => setShowConfetti(false), 2600);
    window.open(whatsAppResponseUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="date-app">
      <BackgroundScene />
      {showConfetti ? <Confetti /> : null}
      <section className="quest-shell" aria-label="Date invitation quest">
        <aside className="story-panel">
          <p className="eyebrow">A tiny quest from {senderName}</p>
          <h1>{heroTitle}</h1>
          <p>Pick what feels cute. I will handle the plan.</p>
        </aside>

        <section className="quest-panel">
          {step === "mood" ? (
            <QuestStep
              eyebrow="First clue"
              icon={Sparkles}
              title="Choose the vibe for us."
              note="Pick whatever feels most you. Soft, easy, and worth smiling about."
              action="Collect vibe"
              onNext={nextStep}
            >
              <ChoiceGrid choices={moods} selected={mood} onSelect={setMood} />
            </QuestStep>
          ) : null}

          {step === "place" ? (
            <QuestStep
              eyebrow="Second clue"
              icon={Utensils}
              title="Pick the plan."
              note={`${senderName} will handle the plan around what you choose.`}
              action="Pick the plan"
              onBack={() => setStep("mood")}
              onNext={nextStep}
            >
              <ChoiceGrid choices={places} selected={place} onSelect={setPlace} />
            </QuestStep>
          ) : null}

          {step === "date" ? (
            <QuestStep
              eyebrow="Third clue"
              icon={Clock}
              title="Choose a day and time."
              note="Whatever feels comfortable. The date can stay sweet and unhurried."
              action="Open final clue"
              onBack={() => setStep("place")}
              onNext={nextStep}
            >
              <div className="date-time-grid">
                <label className="date-input">
                  <span>Date</span>
                  <input
                    min={todayValue}
                    onChange={(event) => setDate(event.target.value)}
                    type="date"
                    value={date}
                  />
                </label>
                <div className="time-choice-group">
                  <span>Time</span>
                  <div className="time-picker" aria-label="Time choices">
                    {timeSlots.map((slot) => (
                      <button
                        className={!customTime && time === slot ? "selected" : ""}
                        key={slot}
                        onClick={() => selectPresetTime(slot)}
                      >
                        <Clock size={17} />
                        {slot}
                      </button>
                    ))}
                  </div>
                  <label className={customTime ? "custom-time-input selected" : "custom-time-input"}>
                    <span>Your time</span>
                    <input
                      aria-label="Your time"
                      onChange={(event) => selectCustomTime(event.target.value)}
                      type="time"
                      value={customTime}
                    />
                  </label>
                </div>
              </div>
            </QuestStep>
          ) : null}

          {step === "answer" ? (
            <QuestStep
              eyebrow="Final unlock"
              icon={MessageCircleHeart}
              title={finalTitle}
              onBack={() => setStep("date")}
            >
              <p className="final-plan-line">
                <Heart size={16} />
                {choiceTitle(moods, mood)} - {choiceTitle(places, place)} - {formatDate(date)} -{" "}
                {time}
              </p>

              <div className="answer-arena" onPointerMove={moveNoButton}>
                <span className="answer-spark">Only if it feels right</span>
                <button className="yes-button" onClick={celebrateYes}>
                  <PartyPopper size={20} />
                  Yes, it is a date
                </button>
                <button
                  aria-label="No button that keeps escaping"
                  className="no-button"
                  onClick={moveNoButton}
                  onFocus={moveNoButton}
                  onPointerDown={moveNoButton}
                  onPointerEnter={moveNoButton}
                  style={{
                    left: `${noPosition.x}%`,
                    top: `${noPosition.y}%`,
                  }}
                >
                  No
                </button>
              </div>

              <div className="final-actions">
                <a
                  className="secondary-button"
                  href={whatsAppResponseUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircleHeart size={18} />
                  WhatsApp Aarav
                </a>
                <button className="ghost-button" onClick={() => copyText(responseMessage)}>
                  {copyState === "copied" ? <Check size={18} /> : <Copy size={18} />}
                  {copyState === "copied" ? "Copied" : "Copy"}
                </button>
              </div>
            </QuestStep>
          ) : null}
        </section>
      </section>
    </main>
  );
}

function BackgroundScene() {
  return (
    <>
      <div className="background-image" aria-hidden="true" />
      <div className="background-wash" aria-hidden="true" />
      <div className="floating-hearts" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
    </>
  );
}

function ChoiceGrid({
  choices,
  onSelect,
  selected,
}: {
  choices: Choice[];
  onSelect: (id: string) => void;
  selected: string;
}) {
  return (
    <div className={choices.length === 3 ? "choice-grid triple" : "choice-grid"}>
      {choices.map((choice) => {
        const Icon = choice.icon;
        return (
          <button
            className={choice.id === selected ? "choice selected" : "choice"}
            key={choice.id}
            onClick={() => onSelect(choice.id)}
          >
            <span className="choice-icon">
              <Icon size={21} />
            </span>
            <span>
              <strong>{choice.title}</strong>
              <small>{choice.subtitle}</small>
            </span>
            {choice.id === selected ? (
              <span className="choice-check" aria-hidden="true">
                <Check size={16} />
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function QuestStep({
  action,
  children,
  eyebrow,
  icon: Icon,
  note,
  onBack,
  onNext,
  title,
}: {
  action?: string;
  children: React.ReactNode;
  eyebrow: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  note?: string;
  onBack?: () => void;
  onNext?: () => void;
  title: string;
}) {
  return (
    <div className="quest-step">
      <div className="step-heading">
        <span className="step-icon">
          <Icon size={22} />
        </span>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
      </div>
      {note ? <p className="step-note">{note}</p> : null}
      {children}
      <div className="step-actions">
        {onBack ? (
          <button className="ghost-button" onClick={onBack}>
            Back
          </button>
        ) : (
          <span />
        )}
        {onNext && action ? (
          <button className="primary-button" onClick={onNext}>
            {action}
            <Sparkles size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 30 }).map((_, index) => (
        <i key={index} />
      ))}
    </div>
  );
}
