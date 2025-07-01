from flask import Flask, render_template, session, request, jsonify
from flask.sessions import SecureCookieSessionInterface
from flask import redirect, url_for
import random
import time

app = Flask(__name__)
app.secret_key = 'snake_secret_key' 

# Game settings
GRID_SIZE = 20
TILE_COUNT_X = 40
TILE_COUNT_Y = 30
INITIAL_LENGTH = 5



def get_game():
    if 'game' not in session:
        session['game'] = new_game()
    return session['game']

def new_game():
    snake = [{'x': 10, 'y': 10}]
    dx, dy = 1, 0
    length = INITIAL_LENGTH
    apple = place_apple(snake)
    return {
        'snake': snake,
        'dx': dx,
        'dy': dy,
        'length': length,
        'apple': apple,
        'score': 0,
        'state': 'playing',
        'last_update': time.time(),
    }

def place_apple(snake):
    while True:
        apple = {
            'x': random.randint(0, TILE_COUNT_X - 1),
            'y': random.randint(0, TILE_COUNT_Y - 1)
        }
        if not any(seg['x'] == apple['x'] and seg['y'] == apple['y'] for seg in snake):
            return apple

def advance_game(game):
    if game['state'] != 'playing':
        return
    head = {'x': game['snake'][0]['x'] + game['dx'], 'y': game['snake'][0]['y'] + game['dy']}
    game['snake'].insert(0, head)
    if len(game['snake']) > game['length']:
        game['snake'].pop()
    # Check apple
    if head['x'] == game['apple']['x'] and head['y'] == game['apple']['y']:
        game['length'] += 1
        game['score'] += 10
        game['apple'] = place_apple(game['snake'])
    # Check collision
    if (
        head['x'] < 0 or head['x'] >= TILE_COUNT_X or
        head['y'] < 0 or head['y'] >= TILE_COUNT_Y or
        any(seg['x'] == head['x'] and seg['y'] == head['y'] for seg in game['snake'][1:])
    ):
        game['state'] = 'gameover'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start():
    session['game'] = new_game()
    return jsonify({'ok': True})

@app.route('/input', methods=['POST'])
def input_dir():
    game = get_game()
    data = request.get_json()
    direction = data.get('direction')
    dx, dy = game['dx'], game['dy']
    if direction == 'up' and dy != 1:
        dx, dy = 0, -1
    elif direction == 'down' and dy != -1:
        dx, dy = 0, 1
    elif direction == 'left' and dx != 1:
        dx, dy = -1, 0
    elif direction == 'right' and dx != -1:
        dx, dy = 1, 0
    game['dx'], game['dy'] = dx, dy
    session['game'] = game
    return jsonify({'ok': True})

@app.route('/state', methods=['GET'])
def state():
    game = get_game()
    # Advance game only if playing
    if game['state'] == 'playing':
        now = time.time()
        if now - game.get('last_update', 0) > 0.1:
            advance_game(game)
            game['last_update'] = now
            session['game'] = game
    return jsonify({
        'snake': game['snake'],
        'apple': game['apple'],
        'score': game['score'],
        'state': game['state'],
        'grid': {'x': TILE_COUNT_X, 'y': TILE_COUNT_Y, 'size': GRID_SIZE}
    })

if __name__ == '__main__':
    app.run(debug=True) 