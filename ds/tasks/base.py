from __future__ import absolute_import

from celery.task import current

from ds.config import celery, db


class ExtendedTask(celery.Task):
    retry_on = (Exception, )

    def __call__(self, *args, **kwargs):
        try:
            rv = super(ExtendedTask, self).__call__(*args, **kwargs)
        except self.retry_on as exc:
            db.session.rollback()
            current.retry(
                exc=exc,
                countdown=min(2 ** current.request.retries, 128),
                throw=True,
            )
        except:
            db.session.rollback()
            raise
        else:
            db.session.commit()
            return rv
        finally:
            db.session.remove()
