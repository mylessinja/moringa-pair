from models import db


class Setting(db.Model):
    __tablename__ = "settings"

    key = db.Column(db.String(80), primary_key=True)
    value = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {"key": self.key, "value": self.value}
