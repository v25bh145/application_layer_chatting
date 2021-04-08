exports.isFullChOl = function(chunk) {
    let array = [];
    array = chunk.slice("\r\n");
    if((array[0].splice(" "))[0] == "ch-ol" && array[array.length - 1] == "end") return true;
    else return false;
}