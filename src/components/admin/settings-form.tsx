"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { iconFor, iconNames, icons } from "@/components/sites/teknosem/icons";
import type { IconCard, SettingKey, Settings } from "@/components/sites/teknosem/settings";
import { saveSetting } from "./actions/content";
import { buttonClass, Card, Field, inputClass, Notice } from "./ui";
import { useAction } from "./use-action";

/** One editable section with its own “Kaydet” button. */
export function SettingsForm<K extends SettingKey>({
  settingKey,
  initial,
  title,
  description,
  children,
}: {
  settingKey: K;
  initial: Settings[K];
  title: string;
  description?: ReactNode;
  children: (value: Settings[K], set: (value: Settings[K]) => void) => ReactNode;
}) {
  const [value, setValue] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const action = useAction();
  return (
    <Card title={title} description={description}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          action.run(() => saveSetting(settingKey, value), "Kaydedildi. Site güncellendi.").then((result) => result.ok && setDirty(false));
        }}
      >
        {children(value, (next) => {
          setValue(next);
          setDirty(true);
        })}
        <div className="flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
          <button type="submit" className={buttonClass.primary} disabled={action.pending}>
            {action.pending ? "Kaydediliyor…" : "Kaydet"}
          </button>
          {dirty && !action.pending && <span className="text-xs text-amber-700">Kaydedilmemiş değişiklikler var.</span>}
          {action.message && (
            <div className="min-w-0 flex-1">
              <Notice tone={action.message.tone}>{action.message.text}</Notice>
            </div>
          )}
        </div>
      </form>
    </Card>
  );
}

type TextFieldProps = { label: string; value: string; onChange: (value: string) => void; hint?: ReactNode; placeholder?: string };

export function TextInput({ label, value, onChange, hint, placeholder }: TextFieldProps) {
  return (
    <Field label={label} hint={hint}>
      <input className={inputClass} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}

export function TextArea({ label, value, onChange, hint, placeholder, rows = 4 }: TextFieldProps & { rows?: number }) {
  return (
    <Field label={label} hint={hint}>
      <textarea className={inputClass} rows={rows} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}

export const PARAGRAPH_HINT = "Yeni paragraf için bir satır boş bırakın.";
export const YEARS_HINT = "{yıl} yazdığınız yere, Kurumsal › İletişim bilgilerindeki tecrübe yılı gelir.";

/** Moves, adds and removes items of a list inside a settings section. */
export function ListControls({ index, count, onMove, onRemove, label }: { index: number; count: number; onMove: (from: number, to: number) => void; onRemove?: () => void; label: string }) {
  return (
    <div className="flex gap-1">
      <button type="button" className={buttonClass.icon} disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label={`${label}: yukarı taşı`}>
        <ArrowUp aria-hidden />
      </button>
      <button type="button" className={buttonClass.icon} disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label={`${label}: aşağı taşı`}>
        <ArrowDown aria-hidden />
      </button>
      {onRemove && (
        <button type="button" className={buttonClass.icon} onClick={onRemove} aria-label={`${label}: kaldır`}>
          <Trash2 aria-hidden />
        </button>
      )}
    </div>
  );
}

export function moveItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/** Icon + title + text cards. `fixed` keeps the number of cards (the page layout expects exactly that many). */
export function IconCardsEditor({ cards, onChange, fixed, hint }: { cards: IconCard[]; onChange: (cards: IconCard[]) => void; fixed?: boolean; hint?: string }) {
  const update = (index: number, card: IconCard) => onChange(cards.map((current, i) => (i === index ? card : current)));
  return (
    <div className="space-y-3">
      {cards.map((card, index) => {
        const Icon = iconFor(card.icon);
        return (
          <div key={index} className="rounded-md border border-neutral-200 bg-neutral-50 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-5 text-blue-700" aria-hidden /> Kart {index + 1}
              </span>
              <ListControls
                index={index}
                count={cards.length}
                label={`Kart ${index + 1}`}
                onMove={(from, to) => onChange(moveItem(cards, from, to))}
                onRemove={fixed ? undefined : () => onChange(cards.filter((_, i) => i !== index))}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-[12rem_1fr]">
              <Field label="Simge">
                <select className={inputClass} value={card.icon} onChange={(event) => update(index, { ...card, icon: event.target.value })}>
                  {iconNames.map((name) => (
                    <option key={name} value={name}>
                      {icons[name].label}
                    </option>
                  ))}
                </select>
              </Field>
              <TextInput label="Başlık" value={card.title} onChange={(title) => update(index, { ...card, title })} hint={hint} />
              <div className="sm:col-span-2">
                <TextArea label="Metin" rows={3} value={card.text} onChange={(text) => update(index, { ...card, text })} />
              </div>
            </div>
          </div>
        );
      })}
      {!fixed && (
        <button type="button" className={buttonClass.secondary} onClick={() => onChange([...cards, { icon: "box", title: "", text: "" }])}>
          <Plus aria-hidden /> Kart ekle
        </button>
      )}
    </div>
  );
}
