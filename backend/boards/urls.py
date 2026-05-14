from rest_framework.routers import DefaultRouter
from boards.views import BoardViewSet, ColumnViewSet, ItemViewSet, LabelViewSet

router = DefaultRouter()
router.register('boards', BoardViewSet)
router.register('columns', ColumnViewSet)
router.register('items', ItemViewSet)
router.register('labels', LabelViewSet)

urlpatterns = router.urls
