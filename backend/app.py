from flask import Flask, request
from flask_cors import CORS, cross_origin
import sqlite3
import bcrypt
from database_utils import create_user, get_hashed_password
from chat_bot import check_pattern, get_feature_names, get_tree, get_features, get_reduced_data, print_disease, sec_predict, calc_condition, get_precautions, getSeverityDict, getDescription, getprecautionDict, get_description
from sklearn.tree import _tree

app = Flask(__name__)
cors = CORS(app)

@app.route("/register", methods=['POST'])
def register():
    request_body = request.get_json()
    username, password = request_body['username'], request_body['password']
    if username == None or password == None or username == "" or password == "":
        return {
                "error": "Credentials are not valid"
        }
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        create_user(username, hashed_password)
        return {
            "username": username
        }
    except:
        return {
            "error": "user creation failed. user may already exist"
        }


@app.route("/login", methods=['POST'])
def login():
    request_body = request.get_json()
    username, password = request_body['username'], request_body['password']
    if username == None or password == None or username == "" or password == "":
        return {
                "error": "Credentials are not valid"
        }

    hashed_password = get_hashed_password(username)
    if not hashed_password:
        return {
            "error": "user doesn't exist"
        }
    if bcrypt.checkpw(password.encode('utf-8'), hashed_password):
        return {
            "username": username
        }
    return {
        "error": "incorrect credentials"
    }

@app.route("/symptom", methods=['POST'])
def confirm_symptom():
    getSeverityDict()
    getDescription()
    getprecautionDict()
    conf, cnf_dis = check_pattern(get_feature_names(), request.get_json()['symptom'])
    if conf == 0:
        return {
            "message": "Symptom is invalid, please enter again.",
            "payload": None,
            "next": False
        }

    if len(cnf_dis) == 1:
        return {
            "message": None,
            "payload": None,
            "next": True
        }

    return {
        "message": "Please type the exact name of the symptom you meant from below:",
        "payload": cnf_dis,
        "next": False 
    }

@app.route("/more_symptoms", methods=['POST'])
def more_symptoms():
    getSeverityDict()
    getDescription()
    getprecautionDict()

    tree_ = get_tree().tree_
    features = get_features(tree_, get_feature_names())

    def recurse(node, depth):
        if tree_.feature[node] != _tree.TREE_UNDEFINED:
            name = features[node]
            threshold = tree_.threshold[node]

            if name == request.get_json()['symptom']:
                val = 1
            else:
                val = 0
            if val <= threshold:
                return recurse(tree_.children_left[node], depth + 1)
            else:
                return recurse(tree_.children_right[node], depth + 1)
        else:
            reduced_data = get_reduced_data()
            red_cols = reduced_data.columns
            present_disease = print_disease(tree_.value[node])
            return (present_disease, red_cols[reduced_data.loc[present_disease].values[0].nonzero()].tolist())

    return {
        "message": "Enter the symptoms you are experiencing from this list with exact names separated by commas(,):",
        "payload": recurse(0, 1),
        "next": True
    }


@app.route("/second_symptom", methods=['POST'])
def second_symptom():
    request_body = request.get_json()
    present_disease = request_body['present_disease']
    symptoms_exp = request_body['symptoms_exp']
    num_days = request_body['num_days']

    print(symptoms_exp)
    second_prediction = sec_predict(symptoms_exp)
    calc_condition(symptoms_exp, num_days)
    if (present_disease[0] == second_prediction[0]):
        return {
            "message": "You may have this disease",
            "payload": [present_disease[0]],
            "next": True
        }

    return {
        "message": "You may have either of these",
        "payload": [present_disease[0], second_prediction[0]],
        "next": True
    }


@app.route("/final", methods=['POST'])
def final():
    print(get_precautions(request.get_json()['present_disease'][0]))
    try:
        one = get_precautions(request.get_json()['present_disease'][0]),
        two = get_description()[request.get_json()['present_disease'][0]],
    except:
        one = None
        two = None

    try:
        three = get_precautions(request.get_json()['second_symptom'][0]),
        four = get_description()[request.get_json()['second_symptom'][0]]
    except:
        three = None
        four = None
    return {
        "message": "Please take these precautions",
        "payload": [
            one, two, three, four
        ],
        "next": True
    }
