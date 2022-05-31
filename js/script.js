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
    //console.log(years);

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
function printNotes(data, year) {
    const listNotesContainer = $('.year' + year + '  .notes-menu__list');

    const source = $('#note-list-template').html();
    const template = Handlebars.compile(source);

    data.forEach((note) => {
        // const fakeElemet = $('<div></div>').append(note.text);
        const text = note.text.slice(0, 30) + '...';
        //console.log(text);
        
        const context = {
            id: note.id,
            title: note.title,
            text: text,
            updatedAt: dayjs(note.updatedAt).format('DD MMMM YYYY')
        };
        
        const html = template(context);
        //console.log(html);
        listNotesContainer.append(html);

    });
    
}