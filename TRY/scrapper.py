import requests


def getCategories():
    urlCategories = "http://localhost:8000/api/v1/genres/"
    genres = []
    while urlCategories:
        r = requests.get(urlCategories, timeout=10)
        r.raise_for_status()
        data = r.json()
        genres += data["results"]
        urlCategories = data["next"]
    return [g["name"] for g in genres]


print(getCategories())


def getFilms():
    urlFilms = "http://localhost:8000/api/v1/titles/"
    films = []
    while urlFilms:
        r = requests.get(urlFilms, timeout=10)
        r.raise_for_status()
        data = r.json()
        films += data["results"]
        urlFilms = data["next"]
    return [f["title"] for f in films]


print(getFilms()[:10])  # Affiche les 10 premiers films


def getMovie():
    prefixURL = "http://localhost:8000/api/v1/titles/"
    movie_id = input("ID du film : ").strip()
    url = f"{prefixURL}{movie_id}"
    r = requests.get(url, timeout=5)
    r.raise_for_status()
    data = r.json()
    return data


print(getMovie())
