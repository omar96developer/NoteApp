const ckEditor = {
    editorInstance: {}
};

let timeout = null;

$(document).ready(function () {

    //global daysjs locale it and utc plugin
    dayjs.locale('it');
    dayjs.extend(window.dayjs_plugin_utc);

    getAllNotes();

    // [6] change active note when click on a note

    $(document).on('click', '.notes-menu__list__item', function () {

        if(ckEditor.editorInstance.id){
            ckEditor.editorInstance.destroy();
            ckEditor.editorInstance = {};
        }

        $(this).addClass('active').siblings().removeClass('active');

        getNote($(this).data('id'));
    });

    //[6] update note text

    $(document).on('keyup', '.note-editor .ck-editor__main .ck-content', function () {
        updateNote();
    });

    //[6] update note title

    $(document).on('keyup', '.note-editor__title', function () {
        updateNote();

    });
});

// [1] API Ajax for printing the notes on left
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
        activateFirstNote();
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

//[4] get one note and activate

function activateFirstNote() {
    const firtsNote = $('.notes-menu__year:first-child .notes-menu__list__item:first-child');
    firtsNote.addClass('active');
    getNote(firtsNote.data('id'));
}

//[5] API Ajax for printing the data of the notes

function getNote(id) {
    $.ajax({
        method: 'GET',
        url: 'https://62961666810c00c1cb6ed9b8.mockapi.io/notes/' + id,
        success: function(data) {
            const updateAt = dayjs(data.updateAt).format('DD MMMM YYYY');
            const dateContainer = $('.note-editor__header-bottom .date');
            dateContainer.html(updateAt);

            const titleContainer = $('.note-editor__title');
            titleContainer.val(data.title);

            const editor = $('#editor');
            editor.data('id', data.id);
            editor.html(data.text);

            ClassicEditor
            .create( editor[0] )
            .catch( error => {
                console.error( error );
            })
            .then(function (editor) {
                //save editor instance in object, when change note we use it to destroy editor
                ckEditor.editorInstance = editor;
                console.log(editor);
            });

        },
        error: function (err){
            console.log(err);
        }
    });
}

//[6] save update note
function saveNote(note) {
    note.updatedAt = dayjs.utc().format();
    $.ajax({
        method: 'PUT',
        data: note,
        url: 'https://62961666810c00c1cb6ed9b8.mockapi.io/notes/' + note.id,
        success: function(data) {
            updateNoteInMenu(data);

        },
        error: function (err){
            console.log(err);
        }
    });
}
function saveNote(note) {
    note.updatedAt = dayjs.utc().format();
  
    $.ajax({
      method: 'PUT',
      data: note,
      url: 'https://62961666810c00c1cb6ed9b8.mockapi.io/notes/' + note.id,
      success: function (data) {
        updateNoteInMenu(data);
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

function updateNoteInMenu(data) {
    const fakeElement = $('<div></div>').append(data.text);
    const text = fakeElement.text().slice(0, 30) + '...';
  
    $('.notes-menu__list__item.active .title').html(data.title);
    $('.notes-menu__list__item.active .text').text(text);
    $('.notes-menu__list__item.active .date').text(dayjs(data.updatedAt).format('DD MMMM YYYY'));
    $('.note-editor__header-bottom .date').text(dayjs(data.updatedAt).format('DD MMMM YYYY hh:mm:ss'));
  }



//[6] deboucing updatenote

function updateNote() {
    const note = {
      id: $('#editor').data('id'),
      text: $('.note-editor .ck-editor__main .ck-content').html(),
      title: $('.note-editor__title').val()
    };
  
    clearTimeout(timeout);
  
    timeout = setTimeout(function () {
      
      saveNote(note);
    }, 1000);
    
  }