# mcalc - Метрологический калькулятор

## v0.1.0

## v0.2.0 
* Изменена модель данных и графический интерфейс приложения.

## v0.2.1 
* Исправлены вычисления для новой модели данных.
* Добавлено разделение расчетов по измерительным каналам.
* Добавлены расчеты погрешностей по средним значениям, расчет СКО.
* Исправлена функция ui.jsonToTable(). Все дополнительные аргументы
объединены в объект options.
* Добавен метод `date.toDOMString()` для конвертации даты в формат `DOMString`
для элемента `<input type=date>`.

## v0.2.2
* Исправлен баг с пересчетом статистических показателей. 

## v0.2.3
* Удалена зависимость от библиотеки JQuery.
* Исправлен баг с отображением undefined при отсутствии статистических показателей.

## v0.3.0
* Добавлена возможность редактирования и удаления измерений.
* Добавлена таблица результатов поверки с возможности редактирования и
удаления записей.
* Добавлено сохранение данных в памяти.
* Исправлена библиотека `lib/ui.js`: значения типа `undefined` и `null` не
выводятся на экран.

## v0.3.1
* Исправлены стили элементов `header` и `p`: удалены лишние отступы. 

## v0.4.0
* Исправлена индексация измерений. При добавлении, редактировании или удалении
измерения происходит пересчет индексов.
* Исправлен баг с выводом нулей в библиотеке `lib/ui.js`.
* Добавлена стилизация заголовков таблиц.
* Добавлен метод получения записей из модели данных с возможностью фильтрации и
сортировки данных.
* Добавлена сортировка результатов на главном экране приложения.
Чтобы выполнить сортировку по значениям некоторого столбца, нужно нажать на 
заголовок соответствующего столбца

## v0.5.0
* Добавлена разбивка результатов измерений на страницы на главном экране.
* Добавлено диалоговое окно подтверждения удаления записей.

## v0.5.1
* Исправлен баг с подсчетом количества страниц таблицы результатов.

## v0.5.2
* Исправлен баг с сортировкой записей по столбцу, первый элемент которого пуст.

## v0.5.3
* Исправлен баг с копированием СИ. Реализовано глубокое копирование результатов
измерений (device.measurements), вместо ссылки на массив данных создается новый массив.
В результате каждое СИ имеет свой массив измерений.

## v0.6.0
* Добавлен экспорт данных в xls.
