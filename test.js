const str = "1:aisa(0 votes)";
const _p = str.split(":");
const id = _p[0];
const option = _p[1].split("(")[0];
const votes = parseInt(_p[1].split("(")[1].split(" "));
console.log({
  id,
  option,
  votes,
});
