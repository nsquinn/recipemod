import psycopg2
from psycopg2.extras import DictCursor
import click
from flask import current_app, g
from flask.cli import with_appcontext

def get_db():
    if 'db' not in g:
        db_name = current_app.config['DATABASE']
        g.db = psycopg2.connect(f'dbname={db_name}', cursor_factory=DictCursor)
            
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
        db.commit()

@click.command('init-db')
@with_appcontext
def init_db_command():
    init_db()
    click.echo('Initialized the database')


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)