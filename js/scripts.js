
const config1 = {
    parent: '#usersTable',
    numberLines: false,
    numberView: '-№-',
    autoColumns: true,
    // noEditColumns: ['id', 'age'],
    columns: [
        {title: '#', value: 'id'},
        {title: 'Аватар', value: 'avatar'},
        {title: 'День Рождения', value: 'birthday'},
        {title: 'Имя', value: 'name'},
        {title: 'Фамилия', value: 'surname'},
        {title: 'Возраст', value: 'age'},
        {title: 'Пометки', value: 'title'},
    ],
    apiUrl: "https://mock-api.shpp.me/aborimsky/users",
    // apiUrl: "https://mock-api.shpp.me/hbondar/users",
    // apiUrl: "https://mock-api.shpp.me/vproshachenko/users",
};

const users = [
    {id: 30050, name: 'Вася', surname: 'Петров', age: 12},
    {id: 30051, name: 'Вася', surname: 'Васечкин', age: 15},
    {name: 'Петя', surname: 'Васечкин', id: 30052, age: 32},
    {id: 30053, name: 'Коля', age: 45},
    {name: 'Степа', surname: 'Савелич', title: 'Описание'},
];

/********************************************************/

// DataTable(config1, users);
DataTable(config1);
