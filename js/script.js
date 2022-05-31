$(document).ready(function () {

    //global daysjs locale it and utc plugin
    dayjs.locale('it');
    dayjs.extend(window.dayjs_plugin_utc);

    getAllNotes();
});

// [1] api Ajax
function getAllNotes() {
    $.ajax({
        method: 'GET',
        url: 'https://62961666810c00c1cb6ed9b8.mockapi.io/notes?sortBy=updatedAt&order=desc',
        success: function(data) {
            if(data.length > 0){
                printListNotes(data);
            }
        },
        error: function (err){
            console.log(err);
        }
    });
}
//[2] HANDLEBARS
function printListNotes(data) {
    //handlebars
    const listYearContainer = $('.notes-menu .notes-menu__main .notes__container');
    const source = $('#note-year').html();
    const template = Handlebars.compile(source);

    //get available years

    const years = [];
    data.forEach((note) => {
        const year = dayjs(note.updatedAt).format('YYYY');
        if(!years.includes(year)) {
            years.push(year);
        }
    });
    console.log(years);

    //print for years 
    years.forEach((year) =>{
        const html = template({year: year});
        listYearContainer.append(html);

        const notesFiltered = data.filter(function (note) {
            return dayjs(note.updatedAt).format('YYYY') === year;

        })

        printNotes(notesFiltered, year);
    });

}

//[3] handlebars con content
function printListNotes(data, year) {
    console.log(data, year);
}