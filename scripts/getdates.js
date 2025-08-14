/*Get current year */
const year = document.querySelector('#year');
const today = new Date();
const current_year = today.getFullYear();
year.innerHTML = current_year;

/*Get last modified date */
const last_modified =  document.querySelector("#lastModified");
const actual_modified_date = document.lastModified;
last_modified.innerHTML = actual_modified_date;