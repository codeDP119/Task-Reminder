var isAlart = false;
var isOver = false;

// Initial Data Load
window.addEventListener("DOMContentLoaded", () => {
  dataFromLocal();
  // targetting all set alarm btn
  const target_Element = document.querySelectorAll(".alarmBtm");
  target_Element.forEach((item) => {
    item.addEventListener("click", alart_true);
  });

  // targetting all cancel alarm btn
  const alarm_can_btn = document.querySelectorAll(".alarm_can_btn");
  alarm_can_btn.forEach((item) => {
    item.addEventListener("click", alart_false);
  });

  // targetting all bell btn
  const displey_alrm_op = document.querySelectorAll(".displey_alrm_op");
  displey_alrm_op.forEach((item) => {
    item.addEventListener("click", displey_al_op);
  });

  // edit item
  const edit_items = document.querySelectorAll(".edit_item");
  edit_items.forEach((item) => {
    item.addEventListener("click", edit_item);
  });

  // delete item
  const delete_item_button = document.querySelectorAll(".delete_item");
  delete_item_button.forEach((item) => {
    item.addEventListener("click", delete_item);
  });
});

// adding note
const add_note = document.getElementById("add_note");
add_note.addEventListener("click", () => {
  const id = new Date().getTime();
  const text = document.getElementById("input_text").value;
  if (isAlart) {
    var ms = document.getElementById("alarmTime").valueAsNumber;
  }
  if (text === "") {
    alert("add text");
    return 0;
  }

  // Add Data In Local Storage
  add_data_to_local(id, text, isAlart, ms);
  // reload data
  location.reload();
  // set Defalult
  setBackToDefault();
});

// clear all data
const clear_all_data = document.querySelector("#clear_all_data");
clear_all_data.addEventListener("click", () => {
  clearItems();
  location.reload();
});

// edit item
const edit_item_button = document.getElementById("edit_item");
edit_item_button.addEventListener("click", () => {
  var edit_note_text = document.getElementById("input_text").value;
  edit_in_local_storage((text = edit_note_text));
});

// !#####################( Alarm Function )#####################//

var alarmSound = new Audio();
alarmSound.src = "alarm.mp3";
var alarmTimer;

// Set Alarm
function setAlarm(ms) {
  var alarm = new Date(ms);
  var alarmTime = new Date(
    alarm.getUTCFullYear(),
    alarm.getUTCMonth(),
    alarm.getUTCDate(),
    alarm.getUTCHours(),
    alarm.getUTCMinutes(),
    alarm.getUTCSeconds()
  );
  var differenceInMs = alarmTime.getTime() - new Date().getTime();
  if (differenceInMs < 0) {
    alert("Specified time ii6vs already passed");
    return;
  }
  alarmTimer = setTimeout(initAlarm, differenceInMs);
}

// Cancel Alarm
function cancelAlarm(button) {
  clearTimeout(alarmTimer);
  button.setAttribute("onclick", "setAlarm(this);");
}

function initAlarm() {
  alarmSound.play();
}

// Stop Alarm
function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
}

// Snooze Alarm for 5min
function snooze() {
  stopAlarm();
  alarmTimer = setTimeout(initAlarm, 300000); // 5 * 60 * 1000 = 5 Minutes
}

// Set isAlart
function alart_true(e) {
  const setAlarmId = e.currentTarget.dataset.id;
  const alarmTimes = alarm_container.querySelectorAll(".alarmTime");
  var ms = () => {
    for (let i = 0; i < alarmTimes.length; i++) {
      let item = alarmTimes[i];
      if (item.getAttribute("data-id") === setAlarmId) {
        return item.valueAsNumber;
      }
    }
  };

  // Get Alarming Data As MS
  ms = ms();
  if (isNaN(ms)) {
    alert("Invalid Date");
    return;
  } else {
    const active_alarm = e.currentTarget;
    active_alarm.classList.toggle("active_alarm");

    const active_snooze_alarm =
      e.currentTarget.nextElementSibling.nextElementSibling;

    active_snooze_alarm.style.display = "inline";

    const active_can_alarm = e.currentTarget.nextElementSibling;

    active_can_alarm.style.display = "inline";

    const active_stop_alarm =
      e.currentTarget.nextElementSibling.nextElementSibling.nextElementSibling;

    active_stop_alarm.style.display = "inline";

    setAlarm(ms);
    // * fetch targeted item
    fetch_item_from_localStorage(setAlarmId, "", true, ms);
  }
}

// Cancel isAlart
function alart_false(e) {
  const setAlarmId = e.currentTarget.dataset.id;
  // * fetch targeted item
  fetch_item_from_localStorage(setAlarmId, "", false, null);
}

//* #####################( Local Storage )##################### *//

// Get Initial Data From Local Storage
function getLocalStorage() {
  return localStorage.getItem("alarm_list")
    ? JSON.parse(localStorage.getItem("alarm_list"))
    : [];
}

// Create Item Taking Data From Local Storage
function dataFromLocal() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((element) => {
      const alarm = document.createElement("div");
      alarm.classList.add("col-11");
      alarm.classList.add("my-2");
      alarm.classList.add("alarm");
      alarm.innerHTML = `<div class="row text-justify">
                  <div class="col-8">
                    <p id="note_text">${element.text}</p>
                  </div>
                  <div class="col-4">
                    <div class="row mx-2 my-2 justify-content-end alrm_op">
                      <div class="col-1" style="margin-right: 17px;">
                        <span id="${element.id}" class="edit_item">
                          <i id="one" class="fas fa-edit"></i>
                        </span>
                      </div>
                      <div class="col-1" style="margin-right: 11px;" >
                        <span id="${element.id}" class="delete_item">
                          <i id="two" class="fas fa-trash-restore-alt"></i>
                        </span>
                      </div>
                      <div class="col-1">
                        <span class="displey_alrm_op">
                          <i id="three" style="margin:0 5px" class="fas fa-bell"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row remd_op ">
                  <div class="col d-flex align-items-center">
                    <div class=" row input_time">
                      <input class="alarmTime" data-id="${element.id}" type="datetime-local" />
                    </div>
                    <div id="alarmOptions">
                      <button class="alarmBtm" data-id="${element.id}">Set Alarm</button>
                      <button class="alarm_can_btn" style="display:none" data-id="${element.id}">Cancel Alarm</button>
                      <button style="display:none" onclick="snooze();">Snooze</button>
                      <button class="stop_alrm" style="display:none" onclick="stopAlarm();">Stop</button>
                    </div>
                  </div>
                </div>`;
      alarm_container.appendChild(alarm);
    });

    const clear_all_data = document.getElementById("clear_all_data");
    clear_all_data.style.display = "block";
  }
}

// Add Data To Local
function add_data_to_local(id, text, isAlart, ms) {
  let alarm_list = getLocalStorage();
  const note = { id, text, isAlart, ms };
  alarm_list.push(note);
  localStorage.setItem("alarm_list", JSON.stringify(alarm_list));
}

// edit id
function pass_edit_id(id) {
  return id;
}

// edit local storage
function edit_in_local_storage(text = text) {
  const edit_id = pass_edit_id(id);
  // * fetch targeted item
  fetch_item_from_localStorage(edit_id, text, "", "");
  // reload page
  location.reload();
}

// delete item from localstorage
function delete_item_from_local(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (String(item.id) !== id) {
      return item;
    }
  });
  localStorage.setItem("alarm_list", JSON.stringify(items));
}

// fetch targeted item from local storage
function fetch_item_from_localStorage(t_id, t_text, t_isAlart, t_ms) {
  let items = getLocalStorage();
  let map = items.filter((item) => {
    if (String(item.id) === t_id) {
      return item;
    }
  });
  let match_map = map.map((item) => {
    if (t_text !== "") {
      item.text = t_text;
    }
    if (t_isAlart !== "") {
      item.isAlart = t_isAlart;
    }
    if (t_ms !== "") {
      item.ms = t_ms;
    }
    return item;
  });
  let diff_map = items.filter((item) => {
    if (String(item.id) !== t_id) {
      return item;
    }
  });
  diff_map.push(match_map[0]);
  localStorage.setItem("alarm_list", JSON.stringify(diff_map));
}

//* #####################( functions )#####################//

// display alarm setting option
function displey_al_op(e) {
  const remd_op =
    e.currentTarget.parentElement.parentElement.parentElement.parentElement
      .nextElementSibling;
  const bell = e.currentTarget;
  bell.classList.toggle("three");
  remd_op.classList.toggle("show_remd_op");
}

// setting default
function setBackToDefault() {
  const text = document.getElementById("input_text");
  text.value = "";
}

// clear all data from document and local storage
function clearItems() {
  if (!confirm("Deleting All Data")) {
    return;
  }
  const items = document.querySelectorAll(".alarm");
  list = document.querySelector("#alarm_container");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  setBackToDefault();
  localStorage.removeItem("alarm_list");
}

// edit item
function edit_item(e) {
  // remove previous submit button
  const add_note = document.getElementById("add_note");
  add_note.style.display = "none";

  // adding edit submit button
  const edit_item = document.getElementById("edit_item");
  edit_item.style.display = "block";

  // set edit item
  const editElement =
    e.currentTarget.parentElement.parentElement.parentElement.parentElement
      .firstElementChild;

  // set form value
  const input_text = document.getElementById("input_text");
  input_text.value = editElement.innerText;

  // editing id
  const edit_id = e.currentTarget.getAttribute("id");
  pass_edit_id((id = edit_id));
}

// delete item
function delete_item(e) {
  const delete_id = e.currentTarget.getAttribute("id");
  const element =
    e.currentTarget.parentElement.parentElement.parentElement.parentElement
      .parentElement;

  const list = document.querySelector("#alarm_container");

  if (!confirm("Deleting Item")) {
    return;
  }
  list.removeChild(element);
  // remove from localstorage
  delete_item_from_local(delete_id);
}
