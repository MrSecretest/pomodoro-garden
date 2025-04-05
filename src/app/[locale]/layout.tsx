import { routing } from "@/i18n/routing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const titles = {
    en: "Pomodoro Garden",
    uk: "Помодоро Сад",
    pl: "Pomidorowy Ogród",
    de: "Pomodoro Garten",
    fr: "Jardin Pomodoro",
    it: "Giardino Pomodoro",
    es: "Jardín Pomodoro",
    tr: "Pomodoro Bahçesi",
    cz: "Rajčatová Zahrada",
    "zh-CN": "番茄花园",
  };

  const descriptions = {
    en: "Boost your productivity with a fun Pomodoro technique timer that grows tomatoes as you work!",
    uk: "Підвищуйте продуктивність з веселим таймером за технікою Помодоро, що вирощує помідори поки ви працюєте!",
    pl: "Zwiększ swoją produktywność dzięki zabawnemu timerowi Pomodoro, który hoduje pomidory podczas pracy!",
    de: "Steigere deine Produktivität mit einem lustigen Pomodoro-Timer, der während der Arbeit Tomaten wachsen lässt!",
    fr: "Boostez votre productivité avec un minuteur Pomodoro amusant qui fait pousser des tomates pendant que vous travaillez !",
    it: "Aumenta la tua produttività con un divertente timer Pomodoro che coltiva pomodori mentre lavori!",
    es: "Aumenta tu productividad con un divertido temporizador Pomodoro que hace crecer tomates mientras trabajas.",
    tr: "Çalışırken domates yetiştiren eğlenceli Pomodoro tekniği zamanlayıcısıyla üretkenliğinizi artırın!",
    cz: "Zvyšte svou produktivitu pomocí zábavného Pomodoro časovače, který pěstuje rajčata během práce!",
    "zh-CN": "通过一个有趣的番茄工作法定时器，在工作时种植番茄，提高你的效率！",
  };

  const metadata = {
    title: titles[locale as keyof typeof titles] || "Pomodoro Garden",
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
  };

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/tomato.png" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta
          name="keywords"
          content="Pomodoro, garden, game, timer, productivity, study, work, focus"
        />
        <meta name="google-adsense-account" content="ca-pub-5003635462439536" />
      </head>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
