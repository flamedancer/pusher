# all the imports
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
from contextlib import closing
import os
import datetime


# create our little application :)
app = Flask(__name__)
#app.config.from_envvar('settings.py', silent=True)
#app.config.from_envvar('settings.py')
app.config.from_object('settings')


def connect_db():
    return sqlite3.connect(app.config['DATABASE'])


def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()


@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()
    g.db.close()


@app.route('/index')
def index():
    cur = g.db.execute('select username, text from entries order by id desc')
    entries = [dict(username=row[0], text=row[1]) for row in cur.fetchall()]
    return render_template('index.html', entries=entries)

@app.route('/show_entries')
def show_entries():
    cur = g.db.execute('select username, text, time from entries order by id desc')
    entries = [dict(username=row[0], text=row[1], time=row[2]) for row in cur.fetchall()]
    return render_template('show_entries.html', entries=entries)

#def add_entry():
#    if not session.get('logged_in'):
#        abort(401)
#    g.db.execute('insert into entries (title, text) values (?, ?)',
#                 [request.form['title'], request.form['text']])
#    g.db.commit()
#    flash('New entry was successfully posted')
#    return redirect(url_for('show_entries'))


@app.route('/add_entry', methods=['POST'])
def add_entry():
    if not session.get('logged_in'):
        #abort(401)
        flash('You need login first!')
        return redirect(url_for('index'))
    g.db.execute('insert into entries (username, text, time) values (?, ?, ?)',
                 [session['username'], request.form['text'], str(datetime.datetime.now())[:19]])
    g.db.commit()
    flash('New entry was successfully posted')
    return redirect(url_for('index'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        cx = g.db.cursor()
        cx.execute('select password from admins where username=%s' % username)
        results = cx.fetchall()
        if request.form['username'] == app.config['USERNAME']:
            error = 'Invalid username'
            if request.form['password'] != app.config['PASSWORD']:
                error = 'Invalid password'
        elif not results:
            error = 'Invalid username'
        elif password != results[0][0]:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            session['username'] = username
            flash('You were logged in')
            return redirect(url_for('index'))
    return render_template('login.html', error=error)

@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        try:
            g.db.execute('insert into admins (username, password) values (?, ?)',
                         [username, password])
            g.db.commit()
        except Exception as e:
            error = 'This username has be used, try another please'
            return render_template('register.html', error=error)
        session['logged_in'] = True
        session['username'] = username
        flash('Welcome %s !' % username)
        return redirect(url_for('index'))
    
    return render_template('register.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(host='0.0.0.0')
