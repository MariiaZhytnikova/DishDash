Практический совет (без лишних слов)
Если ты сомневаешься — сделай так:
Вариант, который почти всегда выигрывает

✅ Сразу React Query для списков (GET /ingredients, GET /recipes, GET /shopping-list)
А локальный UI-state (modals, inputs) — через useState.
Это “правильное разделение”:
server state → React Query
ui state → useState

1️⃣ msw — Mock Service Worker
Что это?

MSW = библиотека для моков API на уровне сети.

Она перехватывает HTTP-запросы (fetch), как будто это настоящий сервер.