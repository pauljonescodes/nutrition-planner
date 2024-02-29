# Nutrition Planner

Nutrition Planner is a calculator for nutrition information and cost.

The app is built around just two primary data structures: an **item** and a
**subitem**. An item has an *ID*, *date*, nutritional information (such as
*calories*, *serving size*, and *macronutrients*), and its *cost in cents*. A
subitem, on the other hand, consists of an *ID*, a *quantity*, and the *ID of an
item*. With just these 2 data structures, this app implements a **log**, a
**library**, a **recipe** creator, and a **planner** which **syncs live** with
your other devices for
[iOS+](https://apps.apple.com/us/app/nutrition-planner/id6478449486),
[Android](https://play.google.com/store/apps/details?id=com.adeptry.nutritionplanner),
[Windows](https://github.com/pauljonescodes/nutrition-planner/releases/download/v1.0.13/Nutrition-Planner-Setup-1.0.13.exe), 
[Linux](https://github.com/pauljonescodes/nutrition-planner/releases/download/v1.0.13/Nutrition-Planner-1.0.13.AppImage), 
and [Web](https://nutritionplanner.app) using
[React](https://react.dev/), [Electron](https://www.electronjs.org/),
[Capacitor](https://capacitorjs.com/), [Chakra](https://chakra-ui.com/),
[RxDB](https://rxdb.info/), and [CouchDB](https://couchdb.apache.org/). It's
translated into Arabic, Chinese, English, Spenish, French, and Hindi, and can display
money formatted in USD, CAD, AUD, GBP, CHF, CNY, JPY, and EUR. You can find more
information about the development process
[here](https://pauljones.codes/2024/02/16/experimental-frontend-application-development/).

## Quick start

```bash
npm install 
npm start # run it
npm package # ship it
```

Only "unauthenticated" CouchDB URLs work for live syncing, ex:

```bash
https://yourcouchdpurl.com:6984/sample/
```

You must include the trailing slash and you may not have user/pass
`http://username:password@...`.

## Other

MIT licensed so do you want with the code.

Contributions welcome.
