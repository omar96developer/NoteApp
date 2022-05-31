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

function printListNotes(data) {
    console.log(data);
}
