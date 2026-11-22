# Лаборатори 1 — Playwright ашигласан UI автомат тест

Энэ лабораторид SauceDemo демо дэлгүүрийн нэвтрэх болон сагсны үйлдлийг TypeScript, Playwright ашиглан автоматжуулав. Амжилттай нэвтрэх, буруу нууц үгээр нэвтрэх, бараа сагсанд нэмэх гэсэн гурван тохиолдлыг тусдаа тестээр шалгасан. Chromium, Firefox, WebKit дээр үндсэн 9 шалгалт болон орчны 3 шалгалт нийт **12/12 амжилттай** ажиллав.

## Ажиллуулах

Node.js 18 буюу түүнээс дээш хувилбар, интернэт холболт хэрэгтэй. Туршсан хувилбар: Node.js 26.13.0, Playwright 1.65.1.

```powershell
cd Lab1/my-first-test
npm.cmd ci
npx.cmd playwright install
npm.cmd test
npm.cmd run report
```

Одоогийн workspace-д dependency, хөтчүүд суусан тул шууд `npm.cmd test` ажиллуулна. Тохиргоо нь `../../.tools/playwright-browsers` хавтсыг байвал автоматаар сонгоно. Өөр компьютерт Playwright-ийн ердийн browser cache ашиглана. PowerShell дээр npm.ps1 execution policy-д хаагдаж болох учраас `.cmd` командыг хэрэглэв. Linux/macOS дээр `npm`, `npx` гэж ажиллуулна.

Зөвхөн үндсэн тест эсвэл нэг хөтчийг сонгох:

```powershell
npx.cmd playwright test tests/mytest.spec.ts
npx.cmd playwright test --project=chromium
```

## Бичсэн тестүүд

| Тест | Үйлдэл | Шалгасан үр дүн |
| --- | --- | --- |
| Амжилттай нэвтрэх | standard_user / secret_sauce | /inventory.html URL, Products гарчиг, Backpack харагдах |
| Буруу нууц үг | standard_user / wrong_password | Алдааны бүтэн мессеж, login URL хэвээр, inventory нээгдэхгүй |
| Бараа сагслах | Backpack нэмээд сагсыг нээх | Badge 1, /cart.html URL, нэг мөр, зөв нэр, тоо хэмжээ 1 |

Сагсны тестийн төгсгөлд барааг устгаж badge арилсныг шалгасан. Нэвтэрсэн тест бүрийн afterEach хэсэгт цэсийг нээгээд Logout дарж, login хуудас руу буцсаныг батална. Буруу нууц үгийн тестэд session үүсэхгүй тул login хуудсанд үлдсэнийг шалгана. Playwright тест бүрд шинэ browser context үүсгэдэг тул session болон localStorage хуваалцахгүй. Нэг тестийг тусад нь ажиллуулахад өмнөх тест шаардлагагүй.

## Locator болон assertion сонголт

Товчийг getByRole, оролтын талбарыг getByPlaceholder, барааны нэрийг getByText, тогтвортой атрибуттай хэсгийг getByTestId ашиглан олсон. SauceDemo нь data-test хэрэглэдэг тул testIdAttribute-ийг data-test гэж тохируулсан. toHaveURL, toHaveText, toBeVisible, toHaveCount ашиглаж, товч дарагдсан эсэхээс гадна үйлдлийн үр дүнг шалгав.

Урт XPath нь DOM-ийн байрлал, завсрын элемент өөрчлөгдөхөд эвдрэх боломжтой. Харин role, харагдах нэр, test id нь тухайн элементийн зориулалтыг кодоос ойлгоход хялбар. Add to cart гэсэн ижил нэртэй олон товч байдаг тул Backpack-ийн test id-тай огтлолцуулж сонгосон. Тогтмол waitForTimeout нэмээгүй; үйлдлийн auto-wait болон дахин шалгадаг assertion ашиглав.

## Үр дүн ба нотолгоо

2026-11-18-нд бодит https://www.saucedemo.com дээр ажиллуулсан эцсийн үр дүн:

| Хөтөч | Үндсэн тест | Орчны тест | Нийт |
| --- | ---: | ---: | ---: |
| Chromium | 3 passed | 1 passed | 4 passed |
| Firefox | 3 passed | 1 passed | 4 passed |
| WebKit | 3 passed | 1 passed | 4 passed |
| **Нийт** | **9 passed** | **3 passed** | **12 passed** |

Эцсийн ажиллуулалт **13.2 секунд** үргэлжилсэн. Хугацаа нь интернэт болон компьютероос хамаарч өөрчлөгдөнө. Git-д хавсаргасан HTML тайлан болон trace файлууд `evidence/passing-report/` дотор бий:

```powershell
npm.cmd run report:evidence
```

Эхний ажиллуулалтад Logout-ийг link гэж сонгосноос тестийн цэвэрлэгээ timeout болсон. Page snapshot дээр Logout нь button байсныг харж getByRole('button', { name: 'Logout', exact: true }) болгон зассаны дараа гурван хөтөч дээр бүгд тэнцсэн. Энэ нь хуучин жишээний locator-ийг шууд хэрэглэхээс өмнө бодит хуудастай тулгах хэрэгтэйг харуулсан.

## Санаатай алдаа ба Trace viewer

`experiments/trace-demo.spec.ts` нь нэвтэрсний дараах бодит Products гарчгийг зориудаар Wrong title гэж шалгана. Үндсэн тестүүдээс тусдаа тохиргоотой:

```powershell
npm.cmd run test:trace-demo
npx.cmd playwright show-report evidence/trace-demo-report
```

Энэ команд **1 failed**, exit code **1** буцаах нь туршилтын зорьсон үр дүн. Алдаа нь toHaveText дээр expected Wrong title, received Products, timeout 2000ms гэж гарсан. Assertion унасан ч finally хэсэгт logout хийдэг. Үүссэн trace-ийг локал Trace viewer-д нээж, сонгогдсон алдаатай алхам, Products гэсэн DOM snapshot, дараах logout алхмуудыг шалгав. Тайлангийн тестийг нээгээд trace холбоосоор орж болно. Эсвэл PowerShell дээр:

```powershell
$traceFile = (Get-ChildItem evidence/trace-demo-report/data -Filter *.zip | Select-Object -First 1).FullName
npx.cmd playwright show-trace "$traceFile"
```

## Codegen турших

```powershell
npm.cmd run codegen
```

Codegen болон Playwright Inspector цонхыг эхлүүлсэн боловч энэ удаагийн desktop удирдлагын хэрэгсэл цонхны handle алдаа өгсөн тул үйлдэл бичүүлж, үүссэн кодыг харьцуулах алхам дуусаагүй. Дахин туршихдаа Username, Password бөглөж Login дарсны дараа гарч буй кодыг tests/mytest.spec.ts-тай харьцуулна. Assertion, сөрөг хувилбар, logout, давтагдах алхмууд байгаа эсэхийг шалгах хэрэгтэй.

## Playwright ба Selenium-ийн талаарх ажиглалт

Энэ ажлаар Playwright-ийн locator болон assertion-уудыг нэг тест дотор хэрэглэхэд ойлгомжтой байлаа. Товч бэлэн болохыг auto-wait хүлээдэг тул үндсэн алхмуудад гараар sleep бичих шаардлага гараагүй. Selenium-ийн баримт бичигт динамик элементтэй ажиллахдаа нөхцөлд тохирсон explicit wait ашиглахыг тайлбарласан байдаг. Playwright Test-д хөтчийн сонголт, assertion, HTML report, trace нэг төслийн тохиргоонд багтаж байгаа нь энэ лабораторийн ажлыг зохион байгуулахад хялбар байсан. Нэг тестийг Chromium, Firefox, WebKit дээр тохиргоогоор давтан ажиллуулж чадсан. Selenium мөн олон хөтөчтэй ажилладаг бөгөөд орчин үеийн Selenium Manager нь driver-ийг автоматаар удирдах боломжтой тул driver-ийг үргэлж гараар суулгана гэж үзэх нь буруу. Trace viewer нь алдаатай алхам болон тухайн үеийн DOM-ийг хамтад нь харуулах тул алдааг тайлбарлахад хэрэгтэй байлаа. Энд Selenium-ийн тест ажиллуулаагүй учраас хоёр хэрэгслийн хурдны талаар хэмжилтийн дүгнэлт хийгээгүй.

## AI туслахыг ашигласан нь

Код, тохиргоо болон баримтжуулалтыг бэлтгэхэд Codex ашигласан. 

## Ашигласан эх сурвалж

- [SauceDemo демо дэлгүүр](https://www.saucedemo.com/)
- [Playwright locator баримт бичиг](https://playwright.dev/docs/locators)
- [Playwright Trace viewer](https://playwright.dev/docs/trace-viewer)
- [Selenium хүлээлтийн стратеги](https://www.selenium.dev/documentation/webdriver/waits/)
- [Selenium Manager](https://www.selenium.dev/documentation/selenium_manager/)
# csa313-01
