import psycopg2
from psycopg2.extras import DictCursor
import click
from flask import current_app, g
from flask.cli import with_appcontext

def get_db():
    if 'db' not in g:
        db_url = current_app.config['DATABASE']
        g.db = psycopg2.connect(db_url, cursor_factory=DictCursor)
        g.db.set_session(autocommit=True)
            
    return g.db
    
def close_db(e=None):
    db = g.pop('db', None)
    
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    
    with current_app.open_resource('schema.sql') as f:
        sql = f.read().decode('utf8')  
        with db.cursor() as c:
            c.execute(sql)
        
@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo('Initialized the database')

@click.command('test-click')
def test_click_command():
    print('Test...passed, i guess.')

def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)