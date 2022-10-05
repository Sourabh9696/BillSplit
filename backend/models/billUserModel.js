module.exports = (sequelize, DataTypes) => {

    const billUser = sequelize.define("billUser", {

        amount: {
            type: DataTypes.DECIMAL(15,2),
            allowNull:false,
            comment: 'Bill Amount'
        }
    })

    return billUser

}