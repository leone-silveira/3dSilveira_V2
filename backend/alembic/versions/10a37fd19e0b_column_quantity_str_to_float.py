"""column quantity str to float

Revision ID: 10a37fd19e0b
Revises: 753e2b35cc5f
Create Date: 2026-01-26 20:43:16.041144

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '10a37fd19e0b'
down_revision: Union[str, Sequence[str], None] = '753e2b35cc5f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
