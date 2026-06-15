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
  Send,
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

const stepLabels: Record<StepId, string> = {
  mood: "Vibe",
  place: "Place",
  date: "Plan",
  answer: "Answer",
};

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
  const [noPosition, setNoPosition] = useState(noButtonSpots[1]);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [showConfetti, setShowConfetti] = useState(false);

  const todayValue = useMemo(() => getTodayValue(), []);
  const currentIndex = steps.indexOf(step);
  const heartCount = currentIndex + 1;
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
          <div className="personal-note" aria-label="Personal note">
            <Heart size={18} />
            <span>
              I made this little date quest just for you. Choose whatever feels
              nice.
            </span>
          </div>
          <div className="quest-hud" aria-label="Quest score">
            <span>
              <Sparkles size={15} />
              Level {currentIndex + 1}/4
            </span>
            <span>
              <Heart size={15} />
              {heartCount} {heartCount === 1 ? "heart" : "hearts"}
            </span>
          </div>
          <div className="progress-track" aria-label="Quest progress">
            {steps.map((item, index) => (
              <button
                aria-current={item === step ? "step" : undefined}
                className={index <= currentIndex ? "active" : ""}
                key={item}
                onClick={() => setStep(item)}
              >
                <span aria-hidden="true">
                  {index <= currentIndex ? <Heart fill="currentColor" size={13} /> : index + 1}
                </span>
                {stepLabels[item]}
              </button>
            ))}
          </div>
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
                <div className="time-picker" aria-label="Time choices">
                  {timeSlots.map((slot) => (
                    <button
                      className={time === slot ? "selected" : ""}
                      key={slot}
                      onClick={() => setTime(slot)}
                    >
                      <Clock size={17} />
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </QuestStep>
          ) : null}

          {step === "answer" ? (
            <QuestStep
              eyebrow="Final unlock"
              icon={MessageCircleHeart}
              title={finalTitle}
              note="If you say yes, I will keep it easy and comfortable."
              onBack={() => setStep("date")}
            >
              <div className="summary-strip">
                <SummaryItem icon={Heart} label="Vibe" value={choiceTitle(moods, mood)} />
                <SummaryItem icon={MapPin} label="Plan" value={choiceTitle(places, place)} />
                <SummaryItem icon={CalendarDays} label="Date" value={formatDate(date)} />
                <SummaryItem icon={Clock} label="Time" value={time} />
              </div>

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

              <div className="pickup-note">
                <MapPin size={18} />
                <strong>I will pick you up, or we can meet wherever you feel comfortable.</strong>
              </div>

              <div className="final-love-note">
                <Heart size={18} />
                <p>I will keep it cozy: good food, easy conversation, and no rush.</p>
              </div>

              <div className="promise-grid" aria-label="Date promises">
                <div>
                  <Heart size={17} />
                  <strong>Easy & comfy</strong>
                  <span>No rush, no awkward pressure.</span>
                </div>
                <div>
                  <Sparkles size={17} />
                  <strong>I will plan it</strong>
                  <span>Place, timing, and little details handled.</span>
                </div>
                <div>
                  <Clock size={17} />
                  <strong>On time</strong>
                  <span>Quest rule: no making you wait.</span>
                </div>
              </div>

              <div className="response-panel">
                <p>{responseMessage}</p>
                <div className="response-actions">
                  <button className="secondary-button" onClick={celebrateYes}>
                    <Send size={18} />
                    Send to Aarav
                  </button>
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

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="summary-item">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
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
