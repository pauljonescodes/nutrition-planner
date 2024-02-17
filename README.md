# Nutrition Planner

At its core, Nutrition Planner is a calculator, perhaps even a simple one. The
app is built around just two primary data structures: an **item** and a
**subitem**. An item is characterized by an ID, date, nutritional information
(such as calories, serving size, and macronutrients), and its cost in cents. A
subitem, on the other hand, consists of an ID, a quantity, and the ID of its
associated item. Leveraging these fundamental structures, I aimed to develop an
application that encompasses a log, an item library, a recipe creator, and a
planner.

However, my goals extended beyond merely creating an application capable of
operating within a single session, displaying information to the user, and then
erasing its memory upon reload. I want an app that can synchronize across
multiple devices, accessible whether on the web, mobile, or desktop platforms,
With these dual objectives of simplicity and comprehensive platform integration
in mind, I embarked on the search for the appropriate tools.

https://pauljones.codes/2024/02/16/experimental-frontend-application-development/

## Run it

```bash
yarn install
yarn next-dev #for browser
yarn nextron-dev #for electron
```

You can probably using NPM too, I just happened to have used Yarn for this project.
