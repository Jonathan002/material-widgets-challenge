# Material Widgets Challenge

This project was created for the Material Widgets Code Challenge.

## Angular Technical Challenge

Set up an angular material (https://material.angular.io/) project to provide CRUD functionality for widgets. Widgets should have an id, title, date, price and description. There should be separate routes for the list and detail pages. 

The list page should utilize an angular material data table with a local datasource. It should be sortable, searchable, paginated, and contain links to a detail page for each widget. The detail page should use appropriate angular material components (e.g. date selectors for the date field).

*Bonus challenges:* 

add a core service for the app to notify users that a widget has been created, updated or deleted.
incorporate a rich text editor for the widget description field.

## About

The application is run with a custom MockModule that will intercept http request and provide CRUD services to a in-memory array that acts as a database.

To update the database with new data run the command `npm run seed:mockdb`. Please be aware that some of the test written written will need to be maintained every time new data is seeded to the application.
