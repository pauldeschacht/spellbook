var db = null;
var status = null;
var search = null;
var notesField = null;
var newTagsField = null;
var newNoteField = null;

function trim(str) {
  return str.replace(/^\s+|\s+$/g,"");
};

function init() {
    //alert('init');
    status = document.querySelector('#status');
    search = document.querySelector('#search');
notesField = document.querySelector('#notes');
newTagsField = document.querySelector('#newTagsField');
newNoteField = document.querySelector('#newNoteField');
    if(window.openDatabase) {
        db =  openDatabase('spell.db','1.0','spell',2*1024*1024);
        if(db) {
            db.transaction( function(tx) {
                tx.executeSql("CREATE TABLE IF NOT EXISTS SPELL (tags TEXT, note TEXT)", [], function(tx, result) {
                    status.innerHTML = 'Db init ok';
                });
            });

            db.transaction(function(tx) {
                tx.executeSql("INSERT INTO SPELL (tags, note) values (?,?)", ['Annick De Schacht', 'another very simple note']);
            });
        }
        else {
            status.innerHTML = 'open database failed';
        }
    }
    else {
        status.innerHTML = 'database is not supported by browser';
    }
};

function insert() {
var tags = newTagsField.value;
var note = newNoteField.value;
tags = trim(tags);
//tags = "'" + tags + "'";
//note = "'" + note + "'";
console.log(tags,note);
db.transaction(function(tx) {
                       tx.executeSql("INSERT INTO SPELL (tags,note) VALUES (?,?)",[tags,note]);
                       });
newTagsField.value = '';
newNoteField.value = '';
}

function load() {
    var sql = 'SELECT rowid,tags,note FROM SPELL WHERE ';
    var searchTerm = search.value;
    var tags = searchTerm.split(' ');
    console.log(tags);
    var first=true;
    for (var i=0; i<tags.length;i++) {
        var cleaned = trim(tags[i]);
        if(cleaned.length>0) {
            if(!first) {
                sql += " AND ";
            }
            sql = sql.concat("tags LIKE '%");
            sql = sql.concat(cleaned);
            sql = sql.concat("%'");
            first=false;
        }
    };
    console.log(sql);
    notesField.innerHTML = '';
    db.transaction(function(tx){
        tx.executeSql(sql, [], function(tx,result) {
            if(result.rows && result.rows.length) {
                status.innerHTML = 'loading from db';
                for(var i=0; i<result.rows.length;i++) {
                    var el = '<div id=' + result.rows.item(i).rowid + '><div class="note">' + result.rows.item(i).note + '</div></div>';

                    console.log(result.rows.item(i).rowid);
                    console.log(el);


                    var li=document.createElement('li');
                    li.innerHTML = el;
                    if(notesField.firstChild) {
                        notesField.insertBefore(li,notesField.firstChild);
                    }
                    else {
                        notesField.appendChild(li);
                    }
                }
            }
        }); 
    });
}

function show() {
var el=document.querySelector('#add');
if(el.style.visibility == "hidden") {
  el.style.visibility = "visible";
  el.style.display = "block";
  } 
else {
  el.style.visibility = "hidden";
  el.style.display = "none";
  }
console.log('hello');
}

var delay = function() {
    var timer=0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer=setTimeout(callback,ms);
    };
}();
