package api

import (
    "encoding/json"
    "net/http"
)

const baseURL = "https://www.themealdb.com/api/json/v1/1/"

func SearchByName(name string) (RecipeResponse, error) {
    url := baseURL + "search.php?s=" + name
    res, err := http.Get(url)
    if err != nil {
        return RecipeResponse{}, err
    }
    defer res.Body.Close()

    var data RecipeResponse
    err = json.NewDecoder(res.Body).Decode(&data)
    return data, err
}
