module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        fullName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            comment: 'Full Name of the user'
        },
        contact: {
            type: DataTypes.STRING(15),
            allowNull: false,
            validate: {
                is: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i
              },
            comment: 'Contact details of the user'
        },
        email: {
            type: DataTypes.STRING(50),
            isUnique: true,
            allowNull: false,
            validate: {
                isEmail: true
            },
            comment: 'Email Id of the user'
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            comment: 'Status of the user 1 denotes active 0 denotes inactive'
        }
    })

    return User

}