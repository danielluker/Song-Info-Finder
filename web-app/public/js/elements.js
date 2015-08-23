var loading = $('#spinner').hide();

console.log("Here");
console.log(loading);

$(document)
  .ajaxStart(function () {
    loading.show();
    console.log("Show");
  })
  .ajaxStop(function () {
    loading.hide();
    console.log("Hide");
  }
);