import requests

# List of websites to monitor
websites = [
    "https://www.google.com",
    "https://www.github.com",
    "https://www.invalidwebsite1234.com",  # Example of an invalid URL
]

def check_website_status(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return f"{url} is up!"
        else:
            return f"{url} is down! Status code: {response.status_code}"
    except requests.exceptions.RequestException as e:
        return f"{url} is down! Error: {e}"

def main():
    print("Website Status Check")
    print("====================")
    for site in websites:
        status = check_website_status(site)
        print(status)

if __name__ == "__main__":
    main()
