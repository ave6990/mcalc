# mcalc - Метрологический калькулятор

##v.0.9.3
* Добавлено отображение количества найденных записей.


## v0.9.2
* Исравлено отображение лишних форм при загрузке приложения.

## v0.9.1
* Добавлен вывод полей пригодность и вид поверки.
* Вывод значений типа `boolean` с помощью символов `✓` и `✗`.

## v0.9.0
* Добавлены поля ввода данных о типе поверки и пригодности СИ.
* Добавлена фильтрация по типу поверки и пригодности СИ.

## v0.8.3
* Добавлена возможность фильтрации по диапазону дат.

## v0.8.2
* Исправлена библиотека `lib/ui.js`.
Обработчики событий (различным событиям можно присвоить несколько обработчиков)
могут быть привязаны к таблице на этапе ее создания.

## v0.8.1
* Исправлен баг с применением фильтра, когда номер текущей страницы больше
количества страниц полученных после фильтрации.

## v0.8.0
* Исправлена библиотека `lib/ui.js`. `ui.jsonToTable` возращает объект DOM.
* Добавлена возможность привязки обработчика событий к таблице на этапе ее создания.
* Выделение строк - стандартный обработчик для таблиц.

## v0.7.5
* Добавлена возможность снятия выделения, что позволяет добавить СИ с нуля.

## v0.7.4
* Удалено поле ввода единиц измерения, ввиду избыточности интерфейса.
Единицы измерения можно указать в поле ввода наименования измерительного канала.

## v0.7.3
* Добавлено поле ввода единиц измерения.

## v0.7.2
* Обобщен функционал диалогового окна удаления записей.
Добавлено подтверждение удаления измерений для СИ.

## v0.7.1
* Исправлена сортировка записей в таблице. Теперь доступна сортировка в порядке
возрастания и убывания.

## v0.7.0
* Добавлена фильтрация результатов поверки.

## v0.6.0
* Добавлен экспорт данных в xls.

## v0.5.3
* Исправлен баг с копированием СИ. Реализовано глубокое копирование результатов
измерений (device.measurements), вместо ссылки на массив данных создается новый массив.
В результате каждое СИ имеет свой массив измерений.

## v0.5.2
* Исправлен баг с сортировкой записей по столбцу, первый элемент которого пуст.

## v0.5.1
* Исправлен баг с подсчетом количества страниц таблицы результатов.

## v0.5.0
* Добавлена разбивка результатов измерений на страницы на главном экране.
* Добавлено диалоговое окно подтверждения удаления записей.

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

## v0.3.1
* Исправлены стили элементов `header` и `p`: удалены лишние отступы. 

## v0.3.0
* Добавлена возможность редактирования и удаления измерений.
* Добавлена таблица результатов поверки с возможности редактирования и
удаления записей.
* Добавлено сохранение данных в памяти.
* Исправлена библиотека `lib/ui.js`: значения типа `undefined` и `null` не
выводятся на экран.

## v0.2.3
* Удалена зависимость от библиотеки JQuery.
* Исправлен баг с отображением undefined при отсутствии статистических показателей.

## v0.2.2
* Исправлен баг с пересчетом статистических показателей. 

## v0.2.1 
* Исправлены вычисления для новой модели данных.
* Добавлено разделение расчетов по измерительным каналам.
* Добавлены расчеты погрешностей по средним значениям, расчет СКО.
* Исправлена функция ui.jsonToTable(). Все дополнительные аргументы
объединены в объект options.
* Добавен метод `date.toDOMString()` для конвертации даты в формат `DOMString`
для элемента `<input type=date>`.

## v0.2.0 
* Изменена модель данных и графический интерфейс приложения.
