
function createDivInBody (html) {
  var elt = document.createElement("div");
  elt.innerHTML = html;
  document.body.appendChild(elt);
  return elt;
}

function checkNotSuccess (res) { console.log(res); throw "The result should never be successful!"; }
function checkNotError (err) { console.log(err); throw "An error has been reached. "+err; }

test("check the API needed for the test engine", function() {
  ok(typeof QanimationFrame === "function", "QanimationFrame available");
});

asyncTest("changing display to none and accessing the style again", 1, function() {
  var el = createDivInBody("Hello world!");
  el.style.display = "block";

  QanimationFrame(function () {
    el.style.display = "none";
    return el;
  })
  .then(function (elt) {
    equal(elt.style.display, "none", "elt is display:none");
  })
  .fail(checkNotError)
  .fin(start);
});

asyncTest("Checking the element height change after adding some content", 1, function() {
  var el = createDivInBody("Hello world!<br/>How are you today?");
  var height = el.offsetHeight;

  QanimationFrame(function() {
     el.innerHTML += "<br/><p>One more text</p>";
     return el;
   })
   .then(function (elt) {
     ok(elt.offsetHeight > height, "offsetHeight has increased.");
     return elt;
   })
   .fail(checkNotError)
   .fin(start);
});
