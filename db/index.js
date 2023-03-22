const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL || 'postgres://localhost:5432/fitness_tracker-dev');

const createUser = async(firstName, lastName, username, password, age, weight, emailAddress, isActive) =>{
    try{
    const { rows: [ user ] } = await client.query(`
        INSERT INTO users(first_name, last_name, username, password, age, weight, email_address, is_active)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `, [firstName, lastName, username, password, age, weight, emailAddress, isActive]);
    return user;
    }catch(err){
        throw err
    }
};

const createActivity = async(name, instructions, reps, sets, equipment, type_id, descritpion) =>{
  
    try{
    const { rows: [ activity ] } = await client.query(`
        INSERT INTO activities(name, instructions, reps, sets, equipment, type_id, description)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `, [name, instructions, reps, sets, equipment, type_id, descritpion]);
        return activity
    }catch(err){
        throw err;
    };
};

const createRoutine = async(creator_id, name, descritpion, typeId, isPublic, isActive)=>{
   try{
    const { rows : [ routine ]} = await client.query(
        `
            INSERT INTO routines(creator_id, name, description, type_id, is_public, is_active)
            VALUES($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [creator_id, name, descritpion, typeId, isPublic, isActive]);    
       return routine
    }catch(err){
        throw err;
    }
};

const createExerciseType = async(name) =>{
    try{
        const { rows : [ type ]} = await client.query(`
            INSERT INTO exercise_type(name)
            VALUES($1)
            RETURNING *;
        `, [name]);
        return type;
    }catch(err){
        throw err;
    }
}

const assignActivityToRoutine = async(routine_id, activity_id) => {
    try{
    const { rows :[ assignemnt ] } = await client.query(`
        INSERT INTO routines_activities(id_routines, id_activities)
        VALUES($1, $2)
        RETURNING *;
    `, [routine_id, activity_id]);
        return assignemnt
    }catch(err){
        throw err;
    }
};

const addPersonalRecord = async(userId, activityId, record) =>{
    try{
        const { rows : [ personalRecord ] } = await client.query(`
            INSERT INTO personal_records(user_id, activity_id, record)
            VALUES($1, $2, $3)
            RETURNING *;
        `, [userId, activityId, record])
        return personalRecord;
    }catch(err){
        throw err;
    }
};

const addActivityToUser = async(userId, activityId) =>{
    try{
        const { rows : [ assignment ] } = await client.query(`
            INSERT INTO users_activities(user_id, activity_id)
            VALUES($1,$2)
            RETURNING*;
        `, [userId, activityId]);
        return assignment
    }catch(err){
        throw err
    }
}

const getActivities = async() => {
    try{
    const {rows: activities} = await client.query(`
        SELECT * FROM activities;
    `)
    return activities;
    }catch(err){
        throw err
    }
};

const getSingleActivity = async(activityId) =>{
    try{
        const { rows: [activity] } = await client.query(`
            SELECT * FROM activities
            WHERE id = $1;
        `, [activityId])
        return activity;
    }catch(err){
        throw err;
    }
};

const getPersonalRecords = async() => {
    try{
        const { rows: personalRecords } = await client.query(`
            SELECT users.first_name, users.last_name, activities.name as activity, record 
            FROM personal_records 
            JOIN users 
            ON personal_records.user_id = users.id
            JOIN activities
            ON personal_records.activity_id = activities.id;
        `)
        return personalRecords;
    } catch (err){
        throw err;
    }
};

const getSingleUserRecords = async(userId) => {
    try{
        const { rows: singleUserRecords } = await client.query(`
        SELECT users.first_name, users.last_name, activities.name as activity, record 
        FROM personal_records 
        JOIN users 
        ON personal_records.user_id = users.id
        JOIN activities
        ON personal_records.activity_id = activities.id
            WHERE user_id = $1;
        `, [userId]);
        return singleUserRecords;
    } catch (err){
        throw err;
    }
};

const getRecordsByActivity = async(activityId) => {
    try{
        const { rows: records } = await client.query(`
        SELECT users.first_name, users.last_name, activities.name as activity, record 
        FROM personal_records 
        JOIN users 
        ON personal_records.user_id = users.id
        JOIN activities
        ON personal_records.activity_id = activities.id
        WHERE activity_id = $1;
        `, [activityId]);
        return records;
    } catch (err) {
        throw err;
    }
};



module.exports={
    client,
    createUser,
    createActivity, 
    createRoutine,
    createExerciseType,
    assignActivityToRoutine,
    addPersonalRecord, 
    addActivityToUser, 
    getActivities,
    getSingleActivity,
    getPersonalRecords,
    getSingleUserRecords,
    getRecordsByActivity
}