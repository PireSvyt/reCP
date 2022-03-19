// TOOLKIT

export function random_id(length = 8) {
  // TESTED
  var temp_id = Math.random().toString(16).substr(2, length);
  var container = document.getElementById(temp_id);
  while (container != null) {
    temp_id = Math.random().toString(16).substr(2, length);
    container = document.getElementById(temp_id);
  }
  return temp_id;
}

export function list_from_dict(dict, field) {
  // TESTED
  var list = [];
  for (const [key, content] of Object.entries(dict)) {
    list.push(content[field]);
  }
  return list;
}

export function get_key_from_dict_field_value(dict, field, value) {
  // TESTED
  for (const [key, content] of Object.entries(dict)) {
    if (content[field] === value) {
      return key;
    }
  }
  return undefined;
}

export function dict_sorter(dict, field, filters = []) {
  // TESTED
  var sorter = undefined;
  if (dict === undefined) {
    return undefined;
  } else {
    if (filters.length > 0) {
      sorter = [];
      for (const [key, val] of Object.entries(dict)) {
        var addItem = true;
        for (const [filter_field, filter_value, filter_test] of filters) {
          switch (filter_test) {
            case "==":
              if (filter_value !== val[filter_field]) {
                addItem = false;
                break;
              }
              break;
            case "!=":
              if (filter_value === val[filter_field]) {
                addItem = false;
                break;
              }
              break;
            default:
              console.error(
                "@dict_sorter, switch filter_test not recognised : " +
                  filter_test
              );
          }
        }
        if (addItem) {
          sorter.push(key);
        }
      }
    } else {
      sorter = Object.keys(dict);
    }
    for (var i = 0; i < sorter.length; i++) {
      var minIdx = i;
      for (var j = i + 1; j < sorter.length; j++) {
        switch (typeof dict[sorter[j]][field]) {
          case "number":
            if (dict[sorter[j]][field] < dict[sorter[minIdx]][field]) {
              minIdx = j;
            }
            break;
          case "string":
            if (dict[sorter[j]][field] < dict[sorter[minIdx]][field]) {
              minIdx = j;
            }
            break;
          default:
            console.error(
              "ERROR dict_sorter type not supported (unsorted outcome)"
            );
            return Object.keys(dict);
        }
      }
      if (minIdx > i) {
        var temp_key = sorter[i];
        sorter.splice(i, 1, sorter[minIdx]);
        sorter.splice(minIdx, 1, temp_key);
      }
    }
  }
  return sorter;
}

export function dict_count_values(dict, field, value) {
  // TESTED
  var counter = 0;
  for (const [key, content] of Object.entries(dict)) {
    if (content[field] === value) {
      counter += 1;
    }
  }
  return counter;
}
