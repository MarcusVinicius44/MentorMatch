import { DevFestEventDate } from "@/types";
import { Calendar, Clock, MapPin, Sparkles, ArrowRight, Video, Users } from "lucide-react";

interface EventScheduleProps {
  events: DevFestEventDate[];
}

export function EventSchedule({ events }: EventScheduleProps) {
  return (
    <section
      aria-labelledby="upcoming-events-title"
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Calendar className="w-4 h-4" /> Calendário da Comunidade
          </div>
          <h2
            id="upcoming-events-title"
            className="text-xl md:text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-1"
          >
            Datas dos Próximos Projetos &amp; Eventos DevFest
          </h2>
        </div>
        <span className="text-xs font-medium text-zinc-500">
          Prepare-se e combine com sua dupla
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt) => {
          const isMainDay = evt.type === "evento";
          const isMentorship = evt.type === "mentoria";

          return (
            <div
              key={evt.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between relative overflow-hidden ${
                isMainDay
                  ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20"
                  : isMentorship
                  ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 hover:border-zinc-300"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isMainDay
                        ? "bg-blue-600 text-white"
                        : isMentorship
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {evt.type === "warmup"
                      ? "Online &bull; Prévia"
                      : evt.type === "hackathon"
                      ? "Maratona Hacker"
                      : evt.type === "evento"
                      ? "DevFest Principal"
                      : "Área de Mentoria"}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-zinc-700 dark:text-zinc-200">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{evt.date}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 leading-snug">
                  {evt.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-zinc-200/60 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{evt.time}</span>
                </div>

                <div className="flex items-center gap-1.5 font-medium">
                  {evt.type === "warmup" ? (
                    <Video className="w-3.5 h-3.5 text-purple-500" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span className="truncate max-w-[180px]">{evt.location}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
