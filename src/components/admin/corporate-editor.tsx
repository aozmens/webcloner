"use client";

import type { Settings } from "@/components/sites/teknosem/settings";
import { IconCardsEditor, PARAGRAPH_HINT, SettingsForm, TextArea, TextInput, YEARS_HINT } from "./settings-form";
import { Field, inputClass } from "./ui";

export function CorporateEditor({ settings }: { settings: Settings }) {
  return (
    <div className="space-y-6">
      <SettingsForm settingKey="contact" initial={settings.contact} title="İletişim bilgileri" description="Üst menüdeki WhatsApp düğmesi, alt bilgi, İletişim sayfası ve form yönlendirmeleri bu bilgileri kullanır.">
        {(contact, set) => (
          <div className="grid gap-3 sm:grid-cols-2">
            <TextInput label="Telefon" value={contact.phone} onChange={(phone) => set({ ...contact, phone })} hint="Örnek: 0 (216) 421 25 95" />
            <TextInput label="E-posta" value={contact.email} onChange={(email) => set({ ...contact, email })} />
            <TextInput label="WhatsApp" value={contact.whatsapp} onChange={(whatsapp) => set({ ...contact, whatsapp })} hint="Ülke koduyla: +90 545 829 06 52. Formlar bu numaraya yönlendirir." />
            <Field label="Tecrübe yılı" hint="Metinlerdeki {yıl} yerine bu sayı yazılır.">
              <input
                className={inputClass}
                type="number"
                min={1}
                value={contact.experienceYears}
                onChange={(event) => set({ ...contact, experienceYears: Number(event.target.value) || 0 })}
              />
            </Field>
            <div className="sm:col-span-2">
              <TextArea label="Adres" rows={2} value={contact.address} onChange={(address) => set({ ...contact, address })} />
            </div>
            <TextInput label="Şehir (alt bilgide)" value={contact.city} onChange={(city) => set({ ...contact, city })} />
            <span />
            <TextInput label="Instagram" value={contact.instagram} onChange={(instagram) => set({ ...contact, instagram })} hint="Boş bırakılan hesap sitede gösterilmez." />
            <TextInput label="LinkedIn" value={contact.linkedin} onChange={(linkedin) => set({ ...contact, linkedin })} />
            <TextInput label="Facebook" value={contact.facebook} onChange={(facebook) => set({ ...contact, facebook })} />
            <TextInput label="YouTube" value={contact.youtube} onChange={(youtube) => set({ ...contact, youtube })} />
          </div>
        )}
      </SettingsForm>

      <SettingsForm settingKey="about" initial={settings.about} title="Hakkımızda" description={YEARS_HINT}>
        {(about, set) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextInput label="Üst etiket" value={about.eyebrow} onChange={(eyebrow) => set({ ...about, eyebrow })} />
              <TextInput label="Sayfa başlığı" value={about.title} onChange={(title) => set({ ...about, title })} />
            </div>
            <TextArea label="Giriş metni" rows={5} value={about.intro} onChange={(intro) => set({ ...about, intro })} />
            <TextInput label="Bölüm başlığı" value={about.heading} onChange={(heading) => set({ ...about, heading })} />
            <TextArea label="Metin" rows={14} value={about.body} onChange={(body) => set({ ...about, body })} hint={PARAGRAPH_HINT} />
          </>
        )}
      </SettingsForm>

      <SettingsForm settingKey="services" initial={settings.services} title="Hizmetler">
        {(services, set) => (
          <>
            <TextInput label="Sayfa başlığı" value={services.title} onChange={(title) => set({ ...services, title })} />
            <TextArea label="Giriş metni" value={services.intro} onChange={(intro) => set({ ...services, intro })} />
            <TextInput label="Slogan" value={services.tagline} onChange={(tagline) => set({ ...services, tagline })} />
            <p className="pt-2 text-sm font-medium">Hizmet kartları</p>
            <IconCardsEditor cards={services.cards} onChange={(cards) => set({ ...services, cards })} />
            <TextInput label="Alt bölüm başlığı" value={services.consultTitle} onChange={(consultTitle) => set({ ...services, consultTitle })} />
            <TextArea label="Alt bölüm metni" rows={6} value={services.consultText} onChange={(consultText) => set({ ...services, consultText })} hint={PARAGRAPH_HINT} />
          </>
        )}
      </SettingsForm>

      <SettingsForm
        settingKey="kvkk"
        initial={settings.kvkk}
        title="KVKK metni"
        description="Kısa ve noktalama ile bitmeyen paragraflar başlık olarak, “a. ”, “b. ” ile başlayanlar maddeli liste olarak gösterilir."
      >
        {(kvkk, set) => (
          <>
            <TextInput label="Üst yazı" value={kvkk.title} onChange={(title) => set({ ...kvkk, title })} />
            <TextArea label="Metin" rows={24} value={kvkk.body} onChange={(body) => set({ ...kvkk, body })} hint={PARAGRAPH_HINT} />
          </>
        )}
      </SettingsForm>
    </div>
  );
}
