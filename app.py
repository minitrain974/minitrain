from flask import Flask, render_template
import os

app = Flask(__name__, static_url_path='/static')

POIS = [
    {'id': 1, 'name': 'Πρυτανεία',
     'lat': 38.28630743461042, 'lng': 21.786857202805194,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 2, 'name': 'Πάρκο Ειρήνης',
     'lat': 38.287309565453135, 'lng': 21.786567524237217,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 3, 'name': 'Φοιτητική Εστία',
     'lat': 38.2862471, 'lng': 21.7897895,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 4, 'name': 'Συνεδριακό & Πολιτιστικό Κέντρο',
     'lat': 38.2902906124496, 'lng': 21.786245659199214,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 5, 'name': 'Βιβλιοθήκη & Κέντρο Πληροφόρησης',
     'lat': 38.28977693795404, 'lng': 21.79117019485482,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 6, 'name': 'Μουσείο Επιστημών και Τεχνολογίας',
     'lat': 38.288016943625315, 'lng': 21.784689977948272,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 7, 'name': 'Τμήμα Μηχανολόγων και Αεροναυπηγών Μηχανικών',
     'lat': 38.28949062600148, 'lng': 21.78749020415793,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 8, 'name': 'Τμήμα Πολιτικών Μηχανικών',
     'lat': 38.289187470938245, 'lng': 21.790880516286844,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 9, 'name': 'Τμήμα Μηχανικών Η/Υ και Πληροφορικής',
     'lat': 38.29040008359405, 'lng': 21.795719221403743,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 10, 'name': 'Τμήμα Ηλεκτρολόγων Μηχανικών και Τεχνολογίας Υπολογιστών',
     'lat': 38.28862326227145, 'lng': 21.788724020333586,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
]


@app.route("/")
def index():
    return render_template("index.html", pois=POIS, gmaps_key=os.getenv("GMAPS_KEY", "AIzaSyC2X6kzSDV9E2wo9wqr4ruQGQalETa7FK0ελα "))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)