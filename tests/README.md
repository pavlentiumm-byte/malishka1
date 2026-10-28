# Проверки ВКадре

Актуальные результаты и ограничения: [QA-REPORT](../docs/QA-REPORT.md). Все перечисленные там сценарии выполнены; прежняя очередь браузерных проверок этапов 2–6 закрыта.

## Логика и синтаксис

```sh
swift -module-cache-path /tmp/vkadre-test-cache tests/run.swift
swift -module-cache-path /tmp/vkadre-test-cache tests/shoots-run.swift
```

Проверяются фильтры, статусы/история проектов, календарь, доступность и приватность, команды/референсы, отзывы, жалобы, блокировки, квота и повреждённые хранилища.

## Браузер

Локальный сервер из корня проекта:

```sh
python3 -m http.server 8010 --bind 127.0.0.1
```

Драйвер использует отдельное хранилище WebKit и очищает тестовые данные после выполнения. Принимает ширину, сценарий, URL, необязательный сценарий после настоящей перезагрузки. Снимки: `/tmp/vkadre-<имя-сценария>-<ширина>.png`.

```sh
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift 320 tests/integration.test.js http://127.0.0.1:8010/ tests/integration-reload.test.js
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift 390 tests/motion.test.js http://127.0.0.1:8010/
swift -module-cache-path /tmp/vkadre-test-cache tests/browser.swift 1280 tests/shoots-browser.test.js http://127.0.0.1:8010/ tests/shoots-reload.test.js
```

Отдельные сценарии: `interface.test.js`, `browser.test.js` (старые записи), `castings-browser.test.js`, `workspace-browser.test.js`, `profile-work-browser.test.js`, `discovery-browser.test.js`, `layout-final.test.js`.

Для проверки подпапки сервер должен отдавать проект по `/wkadre/`. При финальной проверке использовался отдельный временный корень с симлинком на проект и URL `http://127.0.0.1:8011/wkadre/`. Не создавать симлинк внутри самого проекта.

Драйвер проверяет необработанные ошибки JavaScript. Перед итоговым снимком завершает конечные анимации, поскольку невидимое окно WebKit приостанавливает их отрисовку. Сценарии перед этим проверяют обычный интерфейс с активными эффектами.
