module.exports = (sequelize, DataTypes) => {

    const Bill = sequelize.define("bill", {
        name: {
            type: DataTypes.STRING(50),
            allowNull:false,
            comment: 'Bill Name'
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull:false,
            comment: 'Bill Description'
        },
        category: {
            type: DataTypes.STRING(15),
            allowNull:false,
            comment: 'Bill Category'
            
        },
        amount: {
            type: DataTypes.DECIMAL(15,2),
            allowNull:false,
            validate: {
                is: /^\d+(\.\d{1,2})?$/i
              },
            comment: 'Bill Amount'
        }
       
    })

    return Bill

}