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
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 11, 'name': 'Τμήμα Μαθηματικών',
     'lat': 38.29076696373512, 'lng': 21.79026132437305,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 12, 'name': 'Τμήμα Φυσικής',
     'lat': 38.29151641180384 , 'lng': 21.788501795218988,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 13, 'name': 'Τμήμα Πολιτικών Μηχανικών',
     'lat': 38.289025729028474, 'lng': 21.790823463982196,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 14, 'name': 'Τμήμα Χημικών Μηχανικών',
     'lat': 38.289348942833634, 'lng': 21.788885829413157,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'},

    {'id': 15, 'name': 'Τμήμα Γεωλογίας',
     'lat': 38.29210200681285, 'lng': 21.79012576370565,
     'icon': 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}
     
]


@app.route("/")
def index():
    return render_template("index.html", pois=POIS, gmaps_key=os.getenv("GMAPS_KEY", "AIzaSyC2X6kzSDV9E2wo9wqr4ruQGQalETa7FK0ελα "))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)